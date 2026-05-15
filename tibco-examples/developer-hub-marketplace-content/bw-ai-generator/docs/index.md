# BW Logic AI Generator

A local AI tool for **TIBCO BusinessWorks** developers: describe an integration's business logic in plain English and instantly receive stack-specific generated code &mdash; valid XSLT 1.0 for BW5 or Java snippets and BW6 expression language for BW6 &mdash; with no manual syntax lookup.

The app is a [Streamlit](https://streamlit.io) UI in front of a locally hosted [Ollama](https://ollama.com) model, so prompts and generated code never leave the developer's machine.

---

## What it generates

The tool ships with two built-in stack adapters that share a common reasoning core (interpret intent &rarr; normalize conceptually &rarr; render in stack-specific syntax):

- **BW5 &mdash; XSLT.** Produces a complete, valid XSLT 1.0 stylesheet ready to drop into the BW5 **Transform XML** activity, including the XML declaration, root `<xsl:stylesheet>` element with namespaces, inline comments, and an "Input XML Structure" / "Output XML Structure" / "Usage Notes" appendix.
- **BW6 &mdash; Java / Expressions.** Produces BW6-compatible output: a BW6 expression, an optional Java snippet, and usage notes for wiring it into a BW6 process activity.

Each generation is a single self-contained answer &mdash; you copy the code block straight into your BW project.

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Python | 3.8+ | <https://www.python.org/downloads/> |
| Ollama | latest | <https://ollama.com/download> |
| LLM model | `llama3` recommended | `mistral`, `llama3.2`, `codellama` also work |
| Python packages | `streamlit`, `requests` | Installed via `pip install -r requirements.txt` |

---

## Installation

1. Place `tibco_bw_generator.py` (and a `requirements.txt` containing `streamlit` and `requests`) in a project folder:
   ```bash
   mkdir tibco-bw-gen && cd tibco-bw-gen
   ```
2. (Optional but recommended) create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate          # macOS / Linux
   venv\Scripts\activate             # Windows
   ```
3. Install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the app

**Step 1 &mdash; start Ollama with CORS enabled.** The browser-based UI calls Ollama on `localhost`, so the `OLLAMA_ORIGINS` environment variable is required:

```bash
# macOS / Linux
OLLAMA_ORIGINS=* ollama serve

# Windows (PowerShell)
$env:OLLAMA_ORIGINS="*"; ollama serve
```

> Skipping `OLLAMA_ORIGINS=*` produces a connection error in the UI even when Ollama is running.

**Step 2 &mdash; launch the Streamlit app:**

```bash
python -m streamlit run tibco_bw_generator.py
```

The app opens at <http://localhost:8501>. Use `python -m streamlit` (rather than bare `streamlit`) to avoid PATH issues on Windows.

---

## Using the app

1. **Check Ollama status** in the left sidebar &mdash; a green dot with "Ollama: Online" and a model count means you're good. Red means Ollama isn't reachable; revisit Step 1 above.
2. **Pick a model** from the sidebar dropdown (auto-populated from your local Ollama models).
3. **Pick a stack** &mdash; BW5 (XSLT) or BW6 (Java / Expressions).
4. **Describe your logic** in the text area. Be specific &mdash; field names, types, conditions, expected output. Example prompts:
   - "Return full name by concatenating first and last name with a space"
   - "Extract the year from a date string in format YYYY-MM-DD"
   - "Return Active if status equals 1, otherwise return Inactive"
   - "Convert amount from USD to EUR using exchange rate 0.91"
5. **Generate** with the BW5/BW6 button (or `Ctrl+Enter`). Output streams token by token.
6. **Use the output.** For BW5, copy the XSLT into the Transform XML activity and use the "Input XML Structure" block to wrap your inputs. For BW6, paste the expression and Java snippet into the relevant BW6 activity.
7. **Session history** is saved automatically &mdash; scroll past the output to restore an earlier generation.

> The BW5 Transform XML activity only accepts XML document inputs &mdash; not raw strings. Always wrap primitives using the "Input XML Structure" the model emits, e.g. `<root><firstName>John</firstName>...</root>`.

---

## Configuration

Two constants at the top of `tibco_bw_generator.py` are worth knowing:

- `OLLAMA_BASE_URL` &mdash; defaults to `http://localhost:11434`. Change if Ollama runs on a different host or port.
- `DEFAULT_MODEL` &mdash; defaults to `llama3`. Change to any model name you have pulled.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `'streamlit' is not recognized` | Run `python -m streamlit run tibco_bw_generator.py` |
| Sidebar shows "Ollama: Offline" | Start Ollama with `OLLAMA_ORIGINS=* ollama serve` |
| Empty model dropdown | Pull at least one model: `ollama pull llama3` |
| BW5 Transform XML rejects string input | Use the "Input XML Structure" the model emits to wrap primitives in XML |
| Streamlit UI shows white panels | CSS class drift after a Streamlit upgrade &mdash; restart the app |

---

## Quick-start cheat sheet

```bash
# 1. Pull a model (one-time)
ollama pull llama3

# 2. Start Ollama with CORS
OLLAMA_ORIGINS=* ollama serve

# 3. Install dependencies (one-time)
pip install -r requirements.txt

# 4. Run the app
python -m streamlit run tibco_bw_generator.py

# 5. Open in browser
open http://localhost:8501
```

---

## Files in this entry

| File | Purpose |
|---|---|
| `src/tibco_bw_generator.py` | Streamlit application (single file) |
| `docs/index.md` | This document |
