import pandas as pd
import sqlite3
from pathlib import Path

# Get the project root directory
BASE_DIR = Path(__file__).resolve().parent.parent

# File paths
data_path = BASE_DIR / "data" / "cleaned_churn_data.csv"
database_path = BASE_DIR / "sql" / "churn_analysis.db"

# Load cleaned dataset
df = pd.read_csv(data_path)

# Connect to SQLite database
connection = sqlite3.connect(database_path)

# Create/replace customers table
df.to_sql(
    "customers",
    connection,
    if_exists="replace",
    index=False
)

# Close connection
connection.close()

print("Customer data successfully loaded into SQLite.")
print(f"Records loaded: {len(df)}")
print(f"Columns loaded: {len(df.columns)}")
print(f"Database created at: {database_path}")