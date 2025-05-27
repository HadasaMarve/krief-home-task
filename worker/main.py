import time
import os
import psycopg2
import pandas as pd

conn_params = {
    'dbname': 'krief',
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': 5432,
}


def process_document(document_id, filename):
    try:
        file_path = os.path.join('../API/uploads', filename)
        df = pd.read_excel(file_path)

        json_data = df.to_json(orient='records', force_ascii=False)

        conn = psycopg2.connect(**conn_params)
        cur = conn.cursor()

        cur.execute(
            "INSERT INTO processed_data (document_id, data) VALUES (%s, %s)",
            (document_id, json_data)
        )

        cur.execute(
            "UPDATE documents SET status = 'completed' WHERE id = %s",
            (document_id,)
        )

        conn.commit()
        cur.close()
        conn.close()

        print(f"מסמך {document_id} עובר עיבוד בהצלחה.")
    except Exception as e:
        print(f"Error proccessing document {document_id}: {e}")
        try:
            conn = psycopg2.connect(**conn_params)
            cur = conn.cursor()
            cur.execute(
                "UPDATE documents SET status = 'failed' WHERE id = %s",
                (document_id,)
            )
            conn.commit()
            cur.close()
            conn.close()
        except Exception as update_error:
            print(f"Error updating failed document {document_id}: {update_error}")


def poll_documents():
    while True:
        try:
            conn = psycopg2.connect(**conn_params)
            cur = conn.cursor()
            cur.execute("SELECT id, filename FROM documents WHERE status = 'uploaded'")
            documents = cur.fetchall()
            cur.close()
            conn.close()

            for doc in documents:
                document_id, filename = doc
                process_document(document_id, filename)

        except Exception as e:
            print("polling error: ", e)

        # waiting 5 seconds
        time.sleep(5)


if __name__ == '__main__':
    poll_documents()