import chromadb
import ollama

# 1. Connect to the existing local database
client = chromadb.PersistentClient(path="./kohler_vector_db")
collection = client.get_collection(name="kohler_catalog")

# 2. Mock JSON output extracted from Layer 2 (The User's Constraints)
user_query = "A sleek, eco-friendly bathroom faucet"
user_budget_max = 1000
user_style = "Japanese Zen"

# 3. Embed the user's text query
query_response = ollama.embeddings(
    model="nomic-embed-text",
    prompt=user_query
)
query_embedding = query_response["embedding"]

# 4. Perform a Hybrid Search (Vector Similarity + Metadata Filtering)
print(f"Searching for: '{user_query}' under ${user_budget_max}...\n")

results = collection.query(
    query_embeddings=[query_embedding],
    n_results=2,
    # Here we enforce the hard constraints using Chroma's where clause
    where={
        "$and": [
            {"price_usd": {"$lte": user_budget_max}},
            {"style": {"$eq": user_style}}
        ]
    }
)

# 5. Display the matching products
if results['documents'][0]:
    for idx, doc in enumerate(results['documents'][0]):
        metadata = results['metadatas'][0][idx]
        print(f"Match {idx + 1}:")
        print(f"Description: {doc}")
        print(f"Price: ${metadata['price_usd']} | Style: {metadata['style']}\n")
else:
    print("No products found matching the physical and budget constraints.")