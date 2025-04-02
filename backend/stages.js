module.exports = {
  stages: {
    // Stage 1: Unconscious Incompetence
    stage1: {
      name: "Stage 1: Unconscious Incompetence",
      description: "The learner is unaware of time complexity concepts. They don't know what time complexity is or why it is important.",
      criteria: [
        "Learner has not been introduced to time complexity.",
        "Learner doesn't know Big-O notation or how it relates to algorithm efficiency.",
        "Learner has not been introduced to the importance of analyzing efficiency."
      ],
      prompts: [
        "Have you heard of time complexity before? Can you describe what it means?",
        "Imagine two different programs solving the same problem, how do you think we measure which one is faster?",
        "Why do online stores like Amazon need efficient search algorithms?"
      ],
      explanations: [
        "Time complexity is a way to describe how the time it takes for an algorithm to run grows as the size of the input increases.",
        "Efficiency matters because as the input size grows, certain algorithms will perform better, and others will become slower.",
        "Big-O notation helps us understand how different algorithms perform as the input size increases."
      ]
    }
  }
};
