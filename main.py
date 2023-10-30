# Chatbot Stage 1

import os

# required for vector database
import pinecone

# required in Jupyter Notebook mainly where asyncio loops are already running (fixes a bug with asyncio and Jupyter)
import nest_asyncio

# needed for scraping data from website
from langchain.document_loaders.sitemap import SitemapLoader

# Custom scraping rules in SiteMapLoader
from bs4 import BeautifulSoup

# to log an errors produced by the SiteMapLoader when fetching pages from xml URL
import logging

# importing to read pdfs from the xml file
from langchain.document_loaders import PyPDFLoader, UnstructuredXMLLoader

from langchain.document_loaders import UnstructuredPDFLoader, OnlinePDFLoader

# splitting data into data chunks
from langchain.text_splitter import RecursiveCharacterTextSplitter

# converting data chunks to vector embeddings
from langchain.embeddings.openai import OpenAIEmbeddings

# creating vectorstore embeddings
from langchain.vectorstores import Pinecone

# connects with retriever from Pinecone
from langchain.chains import RetrievalQA

# uses the standard Large Language Model by LangChain from OpenAI
from langchain.llms import OpenAI

#            ########################################### Code begins here ###########################################

# obtaining API key from environment variable
api_key = os.environ.get('OPENAI_API_KEY')
os.environ["OPENAI_API_KEY"] = api_key

pinecone.init(
    api_key="210a90bd-5e40-4cfb-ae2c-8b1e84301be6",
    environment="gcp-starter"
)
index = pinecone.Index('uob')

'''
Reading the information directly from the University of Birmingham website
SitemapLoader will load the sitemap from the UoB URL and then scrape and load all pages in the sitemap
returning each page as a document
Web scraping is done concurrently (simultaneously)
'''

nest_asyncio.apply()

# Only required to run below code when setting up embeddings in vector database
# Will create all necessary vector embeddings after 1 successful run so can use existing index

'''
from langchain.document_loaders import WebBaseLoader
loader = WebBaseLoader(["https://www.birmingham.ac.uk/sitemap.xml"])
'''

'''
# Function to remove pdfs when fetching URLs from xml  
def remove_pdf(content: BeautifulSoup) -> str:
    # find all the .pdf files from the xml URL
    pdfElements = content.findAll(".pdf")

    for pdf in pdfElements:
        pdf.decompose()

    return str(content.getText())
'''


#loader = OnlinePDFLoader("https://www.birmingham.ac.uk/sitemap.xml")

loader = SitemapLoader(
    # Require the URL in XML format
    "https://www.birmingham.ac.uk/sitemap.xml",
    continue_on_failure=True,
    #filter_urls=["https://www.birmingham.ac.uk/undergraduate"],  # "https://www.birmingham.ac.uk/funding",
    # "https://www.birmingham.ac.uk/research", "https://www.birmingham.ac.uk/postgraduate",
    # "https://www.birmingham.ac.uk/schools"]
    # "https://www.birmingham.ac.uk/research/activity/civil-engineering/environmental"],

    # failing on this as not able to fetch pages ending in .pdf
    # filter_urls=["https://www.birmingham.ac.uk/research/activity/civil-engineering/environmental"]
    # parsing_function=remove_pdf,
)

#docs = loader.load()

# Splitting the text from the documents into chunks
textSplitter = RecursiveCharacterTextSplitter(
    length_function=len,
    chunk_size=1200,
    chunk_overlap=200,
    # add_start_index=True,
)
#docs_chunks = textSplitter.split_documents(docs)

# Creating embeddings
embeddings = OpenAIEmbeddings()

# creating vectorstore embeddings
index_name = "uob"
#docsearch = Pinecone.from_documents(docs_chunks, embeddings, index_name=index_name)

# already have index then can simply load it shown below ↓ (don't need to run web scraping code or text splitter
docsearch = Pinecone.from_existing_index(index_name, embeddings)

# using LangChain default LLM model provided by OpenAI
llm = OpenAI(temperature=0)

qa_with_sources = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=docsearch.as_retriever(),
                                              return_source_documents=True)

query = "What are the A level requirements to study Computer Science at University of Birmingham?"


result = qa_with_sources({"query": query})
print(result["result"])
print(result["source_documents"])
