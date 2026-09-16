import chromadb
import ollama

# 1. Initialize local ChromaDB client (saves data to a folder)
client = chromadb.PersistentClient(path="./kohler_vector_db")

# Create a new collection for the bathroom products
collection = client.get_or_create_collection(name="kohler_catalog")

# 2. Define your mock product catalog
products = [
    {
        "id": "prod_001",
        "name": "Numi 2.0 Intelligent Toilet",
        "description": "Minimalist modern smart toilet with water-saving dual flush, ambient lighting, and heated seat. Finish: Matte Black.",
        "metadata": {"price_usd": 8500, "style": "Minimalist Modern", "water_saving": True, "type": "Toilet"}
    },
    {
        "id": "prod_002",
        "name": "Artifacts Freestanding Bath",
        "description": "Classic luxury cast iron soaking tub with vintage detailing and claw feet. Finish: White.",
        "metadata": {"price_usd": 4200, "style": "Classic Luxury", "water_saving": False, "type": "Bathtub"}
    },
    {
        "id": "prod_003",
        "name": "Purist Widespread Faucet",
        "description": "Japanese Zen inspired sleek brass faucet with low-flow aerator. Finish: Brushed Brass.",
        "metadata": {"price_usd": 650, "style": "Japanese Zen", "water_saving": True, "type": "Faucet"}
    }
]

# 3. Generate embeddings and store them in ChromaDB
print("Generating embeddings and storing in ChromaDB...")

for product in products:
    # Use Ollama to convert the text description into a vector embedding
    response = ollama.embeddings(
        model="nomic-embed-text", 
        prompt=product["description"]
    )
    embedding = response["embedding"]
    
    # Store the vector, the raw text, and the structured metadata
    collection.add(
        ids=[product["id"]],
        embeddings=[embedding],
        documents=[product["description"]],
        metadatas=[product["metadata"]]
    )

print("Product catalog successfully embedded and stored in ./kohler_vector_db")