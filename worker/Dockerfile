# בחר תמונת בסיס של Python
FROM python:3.9

# הגדרת תיקיית עבודה
WORKDIR /usr/src/app

# העתק קובץ requirements.txt למקרה והתלויות מוגדרות שם
COPY requirements.txt ./

# התקנת התלויות (לדוגמה psycopg2, pandas, openpyxl)
RUN pip install --no-cache-dir -r requirements.txt

# העתק את קוד ה-worker
COPY . .

# הפעלת ה-worker (למשל, הרצת הפונקציה הראשית)
CMD ["python", "worker.py"]
