/**
 * Large-syllabus generation timeout fix (2026-08-21).
 *
 * The topic-plan generate/modify agents produce completions that scale with
 * topic count (up to ~10-11k tokens) but inherited baseAgent's 15 s chat
 * default, so a 14-unit syllabus aborted with AGENT_TIMEOUT and the browser
 * saw "failed to fetch". Pins: both agents pass a scaled timeoutMs above the
 * default; the default itself is untouched; the routes turn AGENT_TIMEOUT
 * into a clean retriable 503 on both the first attempt and the retry.
 */
jest.mock('../agents/framework/baseAgent', () => {
  const actual = jest.requireActual('../agents/framework/baseAgent');
  return { ...actual, runAgent: jest.fn().mockResolvedValue({ topics: [] }) };
});
const base = require('../agents/framework/baseAgent');
const { runTopicPlanGeneratorAgent } = require('../agents/topicPlanGeneratorAgent');
const { runCourseTopicPlanModifyAgent } = require('../agents/courseTopicPlanModifyAgent');
const { sendGenerationTimeoutIfApplicable, GENERATION_TIMEOUT_MESSAGE } = require('../routes/instructorRoutes');

const CTX = 'Syllabus: '.padEnd(200, 'x');

describe('scaledGenerationTimeoutMs', () => {
  it('is above the 15 s chat default and scales with count, capped', () => {
    expect(base.DEFAULT_AGENT_TIMEOUT_MS).toBe(15000); // untouched
    const t4 = base.scaledGenerationTimeoutMs(4);
    const t14 = base.scaledGenerationTimeoutMs(14);
    const t50 = base.scaledGenerationTimeoutMs(50);
    expect(t4).toBeGreaterThan(15000);
    expect(t14).toBeGreaterThan(t4);
    expect(t14).toBe(100000);
    expect(t50).toBe(120000); // cap — still under Cloud Run's 300 s
  });
  it('defaults sanely for missing/invalid counts', () => {
    expect(base.scaledGenerationTimeoutMs(undefined)).toBe(50000);
    expect(base.scaledGenerationTimeoutMs(0)).toBe(50000);
  });
});

describe('topic-plan agents pass a scaled timeoutMs to runAgent', () => {
  beforeEach(() => base.runAgent.mockClear());

  it('generator: timeout > default and grows with topicCount; maxTokens/temperature unchanged', async () => {
    await runTopicPlanGeneratorAgent({ contextText: CTX, topicCount: 4 });
    const small = base.runAgent.mock.calls[0][0];
    await runTopicPlanGeneratorAgent({ contextText: CTX, topicCount: 14 });
    const large = base.runAgent.mock.calls[1][0];
    expect(small.taskName).toBe('topic_plan');
    expect(small.timeoutMs).toBeGreaterThan(15000);
    expect(large.timeoutMs).toBeGreaterThan(small.timeoutMs);
    expect(large.maxTokens).toBe(Math.min(10000, 3800 + 14 * 450));
    expect(large.temperature).toBe(0.35);
  });

  it('modify agent: same scaled-timeout shape', async () => {
    await runCourseTopicPlanModifyAgent({ contextText: CTX, currentTopics: [], modificationRequest: 'add a topic', targetDraftTopicCount: 14 });
    const call = base.runAgent.mock.calls[0][0];
    expect(call.taskName).toBe('topic_plan_modify');
    expect(call.timeoutMs).toBeGreaterThan(15000);
    expect(call.timeoutMs).toBe(base.scaledGenerationTimeoutMs(14));
    expect(call.maxTokens).toBe(Math.min(11000, 4200 + 14 * 500));
  });
});

describe('route: AGENT_TIMEOUT → clean retriable 503', () => {
  const mockRes = () => {
    const res = { headersSent: false, statusCode: null, body: null };
    res.status = (c) => { res.statusCode = c; return res; };
    res.json = (b) => { res.body = b; return res; };
    return res;
  };

  it('returns 503 GENERATION_TIMEOUT with the retriable message', () => {
    const err = new Error('agent_timeout'); err.code = 'AGENT_TIMEOUT';
    const res = mockRes();
    const next = jest.fn();
    sendGenerationTimeoutIfApplicable(err, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(503);
    expect(res.body).toMatchObject({ success: false, code: 'GENERATION_TIMEOUT', retriable: true, error: GENERATION_TIMEOUT_MESSAGE });
    expect(GENERATION_TIMEOUT_MESSAGE).toMatch(/taking longer than expected/);
  });

  it('passes every other error through to next()', () => {
    const err = new Error('boom');
    const res = mockRes();
    const next = jest.fn();
    sendGenerationTimeoutIfApplicable(err, res, next);
    expect(next).toHaveBeenCalledWith(err);
    expect(res.statusCode).toBeNull();
  });

  it('never double-responds when headers were already sent', () => {
    const err = new Error('agent_timeout'); err.code = 'AGENT_TIMEOUT';
    const res = mockRes(); res.headersSent = true;
    const next = jest.fn();
    sendGenerationTimeoutIfApplicable(err, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('all three heavy routes use it (first attempt and validation retry share the try block)', () => {
    const src = require('fs').readFileSync(require.resolve('../routes/instructorRoutes'), 'utf8');
    const uses = src.match(/sendGenerationTimeoutIfApplicable\(e, res, next\);/g) || [];
    expect(uses.length).toBeGreaterThanOrEqual(3);
    // the generate-topics handler's validation retry sits inside the same try
    const start = src.indexOf("router.post('/courses/:courseId/generate-topics'");
    const end = src.indexOf('sendGenerationTimeoutIfApplicable(e, res, next);', start);
    const block = src.slice(start, end);
    expect(block).toMatch(/retrying once with feedback/);
  });
});
