# Chatbot Python Script to Capture Vector Embeddings

import os

# required for vector database
import pinecone

# required in Jupyter Notebook mainly where asyncio loops are already running (fixes a bug with asyncio and Jupyter)
import nest_asyncio

# splitting data into data chunks
from langchain.text_splitter import RecursiveCharacterTextSplitter

# converting data chunks to vector embeddings
from langchain_openai import OpenAIEmbeddings

# creating vectorstore embeddings
from langchain_community.vectorstores import Pinecone

# splitting the text data into chunks that can be processed for vector embeddings
from langchain_community.document_loaders import SitemapLoader

# connects with retriever from Pinecone
from langchain.chains import RetrievalQA

# uses the standard Large Language Model by LangChain from OpenAI
from langchain.llms import OpenAI

# ############################################ code begins here ########################################################

# obtaining API key from environment variable
api_key = os.environ.get('OPENAI_API_KEY')
os.environ["OPENAI_API_KEY"] = api_key

# initialize pinecone
pinecone.init(
    api_key="a9032cde-3f62-4660-8e15-bcbe9607a5c1", #Use .env variable: process.env.PINECONE_API_KEY
    environment="gcp-starter" #Create new .env variable: process.env.PINECONE_ENVIRONMENT
)
index = pinecone.Index('uob')

pdf_docs = []
'''
# list of pdf urls being fetched
pdfUrls = [
    "https://www.birmingham.ac.uk/research/activity/civil-engineering/environmental/sustainability-utility-streetworks-urban-environments.pdf",
    "https://www.birmingham.ac.uk/research/activity/civil-engineering/environmental/micromechanics-of-collapse.pdf",
    "https://www.birmingham.ac.uk/research/activity/civil-engineering/environmental/smart-cities-analysis-of-low-carb-emission-systems-applicability-birmingham.pdf",
    "https://www.birmingham.ac.uk/research/activity/civil-engineering/environmental/sustainability-resilience-food-systems-cities.pdf",

    # These URLs contain images, hence cannot simply be read using OnlinePdfLoader
    # "https://www.birmingham.ac.uk/research/activity/civil-engineering/environmental/sirue-publishable-summary.pdf",
    # "https://www.birmingham.ac.uk/research/activity/civil-engineering/environmental/urban-escape-places.pdf",
    # "https://www.birmingham.ac.uk/research/activity/civil-engineering/environmental/deformation-hydraulic-conductivity-cement-bentonite-slurry.pdf"
    # "https://www.birmingham.ac.uk/research/activity/civil-engineering/environmental/ee-group-poster.pdf",
    # "https://www.birmingham.ac.uk/research/activity/civil-engineering/environmental/micromechanics-collapse-conference-poster.pdf",

    # UoB Regulations for the 2022 - 2023 cohort
    "https://intranet.birmingham.ac.uk/as/registry/legislation/documents/public/cohort-legislation-2022-23/regulations-22-23-section-1.pdf",
    "https://intranet.birmingham.ac.uk/as/registry/legislation/documents/public/cohort-legislation-2022-23/regulations-22-23-section-2.pdf",
    "https://intranet.birmingham.ac.uk/as/registry/legislation/documents/public/cohort-legislation-2022-23/regulations-22-23-section-3.pdf",
    "https://intranet.birmingham.ac.uk/as/registry/legislation/documents/public/cohort-legislation-2022-23/regulations-22-23-section-4.pdf",
    "https://intranet.birmingham.ac.uk/as/registry/legislation/documents/public/cohort-legislation-2022-23/regulations-22-23-section-5.pdf",
    "https://intranet.birmingham.ac.uk/as/registry/legislation/documents/public/cohort-legislation-2022-23/regulations-22-23-section-6.pdf",
    "https://intranet.birmingham.ac.uk/as/registry/legislation/documents/public/cohort-legislation-2022-23/regulations-22-23-section-7.pdf",
    "https://intranet.birmingham.ac.uk/as/registry/legislation/documents/public/cohort-legislation-2022-23/regulations-22-23-section-8.pdf",
    "https://intranet.birmingham.ac.uk/as/registry/legislation/documents/public/cohort-legislation-2022-23/regulations-22-23-section-9.pdf",
]
'''

'''
Reading the information directly from the University of Birmingham website
SitemapLoader will load the sitemap from the UoB URL and then scrape and load all pages in the sitemap
returning each page as a document
Web scraping is done concurrently (simultaneously)
'''

# introducing parallel processing to minimise likelihood of rate limit reached error
nest_asyncio.apply()

# Only required to run below code when setting up embeddings in vector database
# Will create all necessary vector embeddings after 1 successful run so can use existing index

loader = SitemapLoader(
    # Require the URL in XML format
    "https://www.birmingham.ac.uk/sitemap.xml",
    continue_on_failure=True,
)

# loading the web pages I scraped from above using SiteMapLoader
docs = loader.load()

# Splitting the text from the documents into manageable chunks
textSplitter = RecursiveCharacterTextSplitter(
    length_function=len,
    chunk_size=1200,
    chunk_overlap=200,
)

# splitting the text from the web pages scraped into chunks
docs_chunks = textSplitter.split_documents(docs)

print("All URLs fetched. Total:", len(docs_chunks), "URLs.")

# Creating embeddings
embeddings = OpenAIEmbeddings()

# creating vectorstore embeddings
index_name = "uob"

print("Creating vector embeddings for webpages...")

# generating vector embeddings in Pinecone for webpages scraped
web_docsearch = Pinecone.from_documents(docs_chunks, embeddings, index_name=index_name)

# already have index then can simply load it shown below ↓ (don't need to run web scraping or pdf fetching
# web_docsearch = Pinecone.from_existing_index(index_name, embeddings)  # for webpages scraped and pdfs fetched

# using LangChain default LLM model provided by OpenAI
llm = OpenAI()  # (temperature=0)

web_qa_with_sources = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=web_docsearch.as_retriever(),
                                                  return_source_documents=True)

# ######################################### for pdfs fetched start #####################################################

'''
# fetching pdfs from UoB website xml and then storing it in docs list
for pdf in pdfUrls:
    pdf_loader = OnlinePDFLoader(pdf)
    doc = pdf_loader.load()
    pdf_docs.append(doc)

# flattening the pdf docs, so it can be processed by textSplitter
split_pdf = [doc for sublist in pdf_docs for doc in sublist]

# splitting the text from the pdf documents into chunks
pdf_docs_chunks = textSplitter.split_documents(split_pdf)

print("All pdfs fetched. Total:", len(pdf_docs_chunks), "PDFs")

print("Creating vector embeddings for pdfs fetched...")


# generating vector embeddings in Pinecone for pdfs fetched
pdf_docsearch = Pinecone.from_documents(pdf_docs_chunks, embeddings, index_name=index_name)


pdf_qa_with_sources = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=pdf_docsearch.as_retriever(),
                                              return_source_documents=True)
'''

# ########################################## for pdfs fetched end ######################################################

query = "Does the student need to notify the university for procedures regarding any inventions or discoveries?"

result = web_qa_with_sources({"query": query})
print(result["result"])
print(result["source_documents"])
