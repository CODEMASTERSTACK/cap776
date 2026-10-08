# CAP776 Web Evaluator — In-Memory Sandbox & API Guide

> **Note**: This version has been decoupled from any database. All evaluations run 100% in-memory with zero data retention and zero transmission to university databases.

## Architecture

Student Browser / Web Frontend
    |
    v
API / Web Engine (FastAPI or Streamlit)
    |
    +--> Evaluator engine (100% In-Memory Sandbox)
           +--> XLSX validation and recalculation (17 Aug 2026 – 21 Sep 2026)
           +--> DOCX report verification (table extraction + causality check)
           +--> Optional PY AST inspection (syntax + numpy/pandas penalty check)
           +--> Marks + Rubric scoring + PDF generation
           +--> Zero database persistence (No PostgreSQL / Supabase)

## Running the API Server (Option 2 Backend)

```bash
pip install -r requirements.txt
python api.py
```
This starts the evaluation API server at `http://localhost:8000` with the `/api/evaluate` endpoint.

## Running the Streamlit App Directly

```bash
streamlit run app.py
```
All student files and evaluation results are processed strictly in RAM and dismissed immediately.
