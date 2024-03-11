 
# University of Birmingham Chatbot

This chatbot is targeted to individuals who are currently studying at the Univesity of Birmingham or for students who are enrolled onto a course at the University of Birmingham.  

## 🤖 Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`GITHUB_ID`
`GITHUB_SECRET`

_Both of these require you to have a GitHub Account_

`MONGO_URL`

_This can be fetched from your Mongo DB_

`OPENAI_API_KEY`

_This requires you to set up a paid plan with OPENAI_API_KEY. You can fund as a little as $5 to get it running_

`PINECONE_API_KEY`
`PINECONE_ENVIRONMENT`
`PINECONE_INDEX`

_All of these can be fetched from your Pinecone Account_

`CHAT_SECURE_KEY`

_This serves as a secret. key for encrypting and decrypting messages using the AES algoreithm_

```
openssl rand -base64 32
```

_It can be generated by running the above line in the terminal_

`SERVER_EMAIL`

_Set up a server side email address ensuring you set up 2FA_

`SERVER_PASSWORD`

_This is required to authenticate the email sending process allowing the server to login to the email account and send emails programmatically_

`ADMIN_EMAIL`

_This serves as an administrative source to which feedback forms are sent to_

`NEXT_PUBLIC_ADMIN_EMAIL`

_Logging into the application with this email will reveal the "Download Disliked Answers" button for admin use_


## 📚 Tech Stack

**Client**
- React
- Next.js
- Tailwind CSS
- React Feather
- React Icons

**Server**
- Node.js
- MongoDB
- Mongoose

**Authentication & Security**
- Next-Auth
- Crypto-JS
- Bcrypt.js

**Language Models & AI**
- LangChain Framework
- GPT 3.5 Turbo LLM

**Data Handling & Vector Search**
- Python
- Pinecone Vector Embeddings Storage


## 💻 Deployment
_Begin by cloning the git repository from this link:_

```
https://github.com/rohanr07/UoB-Chatbot
```



To run this application execute the following commands:

```
npm install
```
This will install all of the required packages outlined in the package.json file

Next, run the following command:

```
npm run dev
```
This will start the server locally on your computer on a free port (port 3000 commonly used)

On your search engine, you can open:

http://localhost:3000

Or you can click on the link generated in terminal to open the application (this option is recommended)


## 📼 Demo

_The Home page of the chatbot contains a video outlining the seamless navigation across the different interfaces_


## ✍️ Authors

Hi, I am Rohan, the guy behind this chatbot. 

I have mentioned a few of my socials below.

- [@GitHub](https://github.com/rohanr07)
- [@Blog](https://rq7.hashnode.dev)
- [@LinkedIn](https://www.linkedin.com/in/rohanrenganathan/)
- [@X](https://twitter.com/_rohanr007_)



## 🚀 About Me
I'm a Computer Science student who is driven by deep desire to leverage a lasting positive change within society.