## Backend Info  

### The following are steps on how to run the backend  

1. First, you must `cd` into the backend folder. Once you are in the backend folder, then you are able to set up the server.  

2. As of right now, there is no posted API key on the public GitHub due to security reasons. However, if you have a personal `.env` file with your own API key, then that will work as well.  

3. Now that you are in the backend folder with an API key, you must run the following command in the terminal: 
                       `node server.js`

4. If successful, the following message will appear:
         `Server running at http://localhost:5001` 
         `API Docs available at http://localhost:5001/api-docs`

5. To make API calls, you can either go to the API Docs website or do a direct call with Postman.  

### Using API Docs (Preferable Method)  

The API Docs are set up at `http://localhost:5001/api-docs`. Once on the website, use the drop-down menu to reveal the chat.  

There is a simple tutorial on how the message system works on the website. However, to simplify it further:  

- First, click on the **"Try it out"** box on the right side of the screen next to **"Parameters"**.  
- Once you click **"Try it out"**, you can edit the message accordingly.  
- Anything inside the quotation marks (shown as `" "`) is considered part of the message.

- UPDATE: Apart from the message, with API docs, you are now able to select which stage the user is currently on
- UPDATE: User ID is how the messages are track dynamically. Please use the same user id throughout the conversation, so that GPT can respond accordingly
- UPDATE: Different User IDs are saved as different conversations on the server.js

- In the end, the message should look something like:  

```json
{
 "message": "Hello, how are you?",
 "stage": 2,
 "user": user1000
}
```

## Notes  
- **To terminate the Server use CTRL^C on the terminal  
- **The message will also show up directly on the terminal of your IDE.** Any errors will also show up there.  
- **All corresponding errors have a specific code given by OpenAI.**  

## Model Information  

As of right now, the current model available is **ChatGPT 4.0 mini**.  
