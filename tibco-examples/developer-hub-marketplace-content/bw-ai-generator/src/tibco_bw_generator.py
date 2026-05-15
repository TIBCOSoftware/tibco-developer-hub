import streamlit as st
import requests
import json
from datetime import datetime

# ─── PAGE CONFIG ──────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="TIBCO BW AI Generator",
    page_icon="⚙️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─── CONSTANTS ────────────────────────────────────────────────────────────────
OLLAMA_BASE_URL = "http://localhost:11434"

CORE_SYSTEM_PROMPT = """You are an expert middleware integration engineer specializing in TIBCO BusinessWorks.
You follow a 3-step reasoning approach:
  Step 1: Interpret and understand the business logic in natural language.
  Step 2: Normalize it into a conceptual model (inputs, transformations, outputs).
  Step 3: Render the solution using the specified stack's conventions and syntax.

Always be precise, concise, and production-ready. Format code blocks clearly using markdown."""

STACK_CONFIGS = {
    "BW5 – XSLT": {
        "id": "BW5",
        "badge": "XSLT Only",
        "color": "#00C2FF",
        "icon": "⚙️",
        "template": """You are a TIBCO BusinessWorks 5.x expert. The user will describe a business logic requirement.
Your job is to:
1. Understand the intent of the logic.
2. Produce ONLY a complete, valid XSLT 1.0 stylesheet that implements the described logic.
3. Always include the full <?xml version="1.0" encoding="UTF-8"?> declaration and <xsl:stylesheet> root element with correct namespace declarations.
4. CRITICAL - INPUT HANDLING: The TIBCO BW5 "Transform XML" activity requires XML document input — it cannot accept plain strings directly.
   - Always wrap string/primitive inputs inside an XML root element. For example, if the user passes firstName and lastName as strings, the input XML must look like: <root><firstName>John</firstName><lastName>Doe</lastName></root>
   - In the XSLT, reference these using XPath like: <xsl:value-of select="/root/firstName"/>
   - Never use xsl:template match on a plain string. Always match on an XML element (e.g., match="/root" or match="/").
   - If the logic involves a single string input, wrap it as: <root><value>the string</value></root> and reference it as /root/value in the XSLT.
5. The output of the XSLT must also be well-formed XML. Wrap the output in a root element like <output> or a meaningful element name.
6. Add inline XML comments (<!-- -->) on key lines to explain what each part does.
7. After the XSLT block, add:
   - "Input XML Structure" — show the exact XML structure the user must feed into the Transform XML activity.
   - "Output XML Structure" — show what the XSLT will produce.
   - "Usage Notes" — how to configure the Transform XML activity in BW5 Designer.
8. Do NOT output XPath-only snippets, Java code, or anything BW6-specific. Output XSLT ONLY.

Business Logic Request: """,
    },
    "BW6 – Java / Expressions": {
        "id": "BW6",
        "badge": "Java / Expressions",
        "color": "#FF6B35",
        "icon": "🔷",
        "template": """You are a TIBCO BusinessWorks 6.x expert. The user will describe a business logic requirement.
Your job is to:
1. Understand the intent of the logic.
2. Produce ONLY BW6-compatible output using Java snippets and/or BW6 expression language.
3. Annotate each output line with a brief comment explaining it.
4. Output in structured sections: "BW6 Expression", "Java Snippet" (if applicable), "Usage Notes".
5. Use modern Java (Java 8+) idioms and BW6 palette activity conventions.
6. Do NOT produce XPath or any BW5-specific syntax.

Business Logic Request: """,
    },
}

EXAMPLES = [
    "Return full name by concatenating first and last name with a space",
    "Extract the year from a date string in format YYYY-MM-DD",
    "Convert amount from USD to EUR using exchange rate 0.91",
    "Return 'Active' if status equals 1, otherwise return 'Inactive'",
    "Trim whitespace and convert email to lowercase",
    "Sum all line item totals in an order array",
    "Format a phone number by removing dashes and spaces",
    "Check if an order amount exceeds 1000 and apply 10% discount",
]

# ─── CUSTOM CSS ───────────────────────────────────────────────────────────────
st.markdown("""
<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Inter:wght@400;600;700&display=swap');

  /* ── GLOBAL DARK OVERRIDE ── */
  html, body, [class*="css"],
  .stApp, .main, .block-container,
  [data-testid="stAppViewContainer"],
  [data-testid="stAppViewBlockContainer"],
  [data-testid="stVerticalBlock"],
  [data-testid="stHorizontalBlock"],
  section.main > div,
  div.stMarkdown, div.element-container {
    background-color: #0a0a1a !important;
    color: #e0e0f0 !important;
    font-family: 'Inter', sans-serif;
  }

  /* ── SIDEBAR ── */
  [data-testid="stSidebar"],
  [data-testid="stSidebar"] > div,
  [data-testid="stSidebar"] .stMarkdown,
  [data-testid="stSidebar"] [data-testid="stVerticalBlock"] {
    background-color: #0d0d22 !important;
    border-right: 1px solid #1a1a3a !important;
  }
  [data-testid="stSidebar"] * { color: #c0c8e8 !important; }
  [data-testid="stSidebar"] strong { color: #fff !important; }

  /* ── MAIN CONTENT TEXT ── */
  p, span, label, div, li, td, th { color: #e0e0f0 !important; }
  h1, h2, h3, h4, h5, h6 {
    color: #ffffff !important;
    font-family: 'IBM Plex Mono', monospace !important;
  }

  /* ── BUTTONS ── */
  .stButton > button {
    background: linear-gradient(90deg, #00C2FF, #0080AA) !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 10px !important;
    font-weight: 700 !important;
    font-family: 'IBM Plex Mono', monospace !important;
    letter-spacing: 1px !important;
    text-transform: uppercase !important;
    padding: 10px 20px !important;
  }
  .stButton > button:hover {
    box-shadow: 0 0 24px #00C2FF66 !important;
  }
  .stButton > button:disabled {
    background: #1a1a3a !important;
    color: #445566 !important;
  }
  /* Example chip buttons — dark override for ALL column buttons */
  div[data-testid="column"] .stButton > button,
  div[data-testid="stHorizontalBlock"] .stButton > button,
  .stButton > button[kind="secondary"],
  .stButton > button[kind="tertiary"] {
    background: #111128 !important;
    color: #7788bb !important;
    border: 1px solid #222244 !important;
    border-radius: 10px !important;
    font-size: 11px !important;
    font-weight: 500 !important;
    text-transform: none !important;
    letter-spacing: 0 !important;
    padding: 8px 12px !important;
    box-shadow: none !important;
  }
  div[data-testid="column"] .stButton > button:hover,
  div[data-testid="stHorizontalBlock"] .stButton > button:hover {
    background: #1a1a3a !important;
    color: #00C2FF !important;
    border-color: #00C2FF55 !important;
    box-shadow: 0 0 10px #00C2FF22 !important;
  }

  /* ── TEXT AREA ── */
  .stTextArea textarea,
  .stTextArea > div,
  .stTextArea > div > div {
    background-color: #050510 !important;
    color: #c8d8ff !important;
    border: 1px solid #1a1a3a !important;
    border-radius: 10px !important;
    font-family: 'IBM Plex Mono', monospace !important;
    font-size: 13px !important;
  }
  .stTextArea textarea:focus {
    border-color: #00C2FF !important;
    box-shadow: 0 0 12px #00C2FF33 !important;
  }
  .stTextArea label { color: #6677aa !important; }

  /* ── SELECT / DROPDOWN ── */
  .stSelectbox > div > div,
  .stSelectbox > div > div > div,
  [data-testid="stSelectbox"] div,
  [data-baseweb="select"] > div,
  [data-baseweb="select"] {
    background-color: #0d0d22 !important;
    color: #00C2FF !important;
    border-color: #1a1a3a !important;
  }
  [data-baseweb="popover"],
  [data-baseweb="popover"] ul,
  [data-baseweb="menu"],
  [data-baseweb="menu"] li,
  [role="listbox"],
  [role="option"] {
    background-color: #0d0d22 !important;
    color: #c0c8e8 !important;
    border-color: #1a1a3a !important;
  }
  [role="option"]:hover { background-color: #1a1a3a !important; }

  /* ── RADIO BUTTONS ── */
  .stRadio > div { gap: 10px; }
  .stRadio label {
    background: #0d0d22 !important;
    border: 1px solid #1a1a3a !important;
    border-radius: 8px !important;
    padding: 8px 14px !important;
    color: #aabbcc !important;
  }
  .stRadio label:hover { border-color: #00C2FF !important; }

  /* ── EXPANDER ── */
  [data-testid="stExpander"],
  [data-testid="stExpander"] > div,
  .streamlit-expanderHeader,
  .streamlit-expanderContent,
  details, summary {
    background-color: #0d0d22 !important;
    color: #aabbcc !important;
    border-color: #1a1a3a !important;
  }
  .streamlit-expanderHeader:hover { border-color: #00C2FF44 !important; }

  /* ── METRICS ── */
  [data-testid="metric-container"],
  [data-testid="metric-container"] > div {
    background-color: #0d0d22 !important;
    border: 1px solid #1a1a3a !important;
    border-radius: 10px !important;
  }
  [data-testid="stMetricValue"] { color: #00C2FF !important; }
  [data-testid="stMetricLabel"] { color: #6677aa !important; }

  /* ── CODE / PRE ── */
  code, pre, .stCode,
  [data-testid="stCode"],
  [data-testid="stCode"] > div,
  [data-testid="stCode"] pre {
    background-color: #050510 !important;
    color: #c8d8ff !important;
    border: 1px solid #1a1a3a !important;
    border-radius: 8px !important;
    font-family: 'IBM Plex Mono', monospace !important;
  }

  /* ── ALERTS / INFO BOXES ── */
  .stAlert, [data-testid="stAlert"],
  .stSuccess, .stWarning, .stError, .stInfo {
    background-color: #0d0d22 !important;
    border-radius: 10px !important;
    color: #e0e0f0 !important;
  }

  /* ── SPINNER ── */
  .stSpinner > div { color: #00C2FF !important; }

  /* ── DIVIDER ── */
  hr { border-color: #1a1a3a !important; opacity: 1 !important; }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #0a0a1a; }
  ::-webkit-scrollbar-thumb { background: #1a1a3a; border-radius: 4px; }

  /* ── CUSTOM CARDS ── */
  .bw-card {
    background: #0d0d22 !important;
    border: 1px solid #1a1a3a;
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 16px;
  }
  .bw-card-bw5 { border-color: #00C2FF44 !important; box-shadow: 0 0 20px #00C2FF11; }
  .bw-card-bw6 { border-color: #FF6B3544 !important; box-shadow: 0 0 20px #FF6B3511; }

  .status-online { color: #22c55e !important; }
  .status-offline { color: #ef4444 !important; }

  .badge {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 700; letter-spacing: 1px;
    font-family: 'IBM Plex Mono', monospace;
  }
  .badge-bw5 { background: #00C2FF22; color: #00C2FF !important; border: 1px solid #00C2FF44; }
  .badge-bw6 { background: #FF6B3522; color: #FF6B35 !important; border: 1px solid #FF6B3544; }

  /* ── DEPLOY / HAMBURGER MENU ── */
  [data-testid="stToolbar"],
  [data-testid="stDecoration"],
  [data-testid="stHeader"] {
    background-color: #0a0a1a !important;
  }

  /* ── CAPTION TEXT ── */
  .stCaption, small { color: #556688 !important; }
</style>
""", unsafe_allow_html=True)


# ─── SESSION STATE ────────────────────────────────────────────────────────────
if "history" not in st.session_state:
    st.session_state.history = []
if "last_output" not in st.session_state:
    st.session_state.last_output = ""


# ─── OLLAMA HELPERS ───────────────────────────────────────────────────────────
def check_ollama_status():
    try:
        r = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=3)
        if r.status_code == 200:
            models = [m["name"] for m in r.json().get("models", [])]
            return True, models
    except Exception:
        pass
    return False, []


def stream_ollama(model: str, system: str, prompt: str):
    payload = {
        "model": model,
        "system": system,
        "prompt": prompt,
        "stream": True,
        "options": {"temperature": 0.3, "top_p": 0.9},
    }
    with requests.post(
        f"{OLLAMA_BASE_URL}/api/generate",
        json=payload,
        stream=True,
        timeout=120,
    ) as r:
        r.raise_for_status()
        for line in r.iter_lines():
            if line:
                chunk = json.loads(line)
                if "response" in chunk:
                    yield chunk["response"]
                if chunk.get("done"):
                    break


# ─── SIDEBAR ─────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("""
    <div style='text-align:center; padding: 10px 0 20px;'>
      <div style='font-size:32px;'>⚙️</div>
      <div style='font-family: IBM Plex Mono; font-weight:800; font-size:16px; color:#fff;'>
        TIBCO BW<br/>
        <span style='background: linear-gradient(90deg,#00C2FF,#FF6B35);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;'>
          AI Generator
        </span>
      </div>
      <div style='font-size:10px; color:#334466; letter-spacing:3px; margin-top:6px;'>
        HACKATHON 2025
      </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("---")

    # Ollama status
    ollama_ok, available_models = check_ollama_status()
    if ollama_ok:
        st.markdown(f"🟢 **Ollama:** <span class='status-online'>Online</span>", unsafe_allow_html=True)
        st.caption(f"{len(available_models)} model(s) available")
    else:
        st.markdown("🔴 **Ollama:** <span class='status-offline'>Offline</span>", unsafe_allow_html=True)
        st.error("Start Ollama:\n```\nOLLAMA_ORIGINS=* ollama serve\n```")

    st.markdown("---")

    # Model selector
    if available_models:
        selected_model = st.selectbox("🤖 Model", available_models, index=0)
    else:
        selected_model = st.text_input("🤖 Model name", value="llama3")
        st.caption("Pull model: `ollama pull llama3`")

    st.markdown("---")

    # Stack selector
    st.markdown("**Select Stack:**")
    stack_choice = st.radio(
        "Stack",
        list(STACK_CONFIGS.keys()),
        label_visibility="collapsed",
    )

    st.markdown("---")

    # Stats
    st.markdown("**Session Stats**")
    col1, col2 = st.columns(2)
    col1.metric("Generations", len(st.session_state.history))
    bw5_count = sum(1 for h in st.session_state.history if h["stack"] == "BW5")
    bw6_count = sum(1 for h in st.session_state.history if h["stack"] == "BW6")
    col2.metric("BW5 / BW6", f"{bw5_count} / {bw6_count}")

    st.markdown("---")

    # Clear history
    if st.button("🗑️ Clear History", use_container_width=True):
        st.session_state.history = []
        st.session_state.last_output = ""
        st.rerun()

    st.markdown("""
    <div style='text-align:center; margin-top:20px; font-size:10px; color:#2a2a4a; letter-spacing:1px;'>
      Powered by Ollama + Streamlit
    </div>
    """, unsafe_allow_html=True)


# ─── MAIN CONTENT ─────────────────────────────────────────────────────────────
stack_cfg = STACK_CONFIGS[stack_choice]
stack_id = stack_cfg["id"]
stack_color = stack_cfg["color"]
badge_class = f"badge-{stack_id.lower()}"

# Header
st.markdown(f"""
<div style='text-align:center; padding: 10px 0 30px;'>
  <div style='font-size:11px; letter-spacing:5px; color:#556688; margin-bottom:8px; text-transform:uppercase;'>
    TIBCO Hackathon 2025
  </div>
  <h1 style='margin:0; font-size:clamp(22px,4vw,38px); color:#fff;'>
    BW Logic <span style='background:linear-gradient(90deg,#00C2FF,#FF6B35);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;'>
      AI Generator
    </span>
  </h1>
  <p style='color:#6677aa; font-size:13px; margin-top:8px;'>
    Describe logic in plain English → Get stack-specific code instantly
  </p>
</div>
""", unsafe_allow_html=True)

# Active stack banner
st.markdown(f"""
<div class='bw-card bw-card-{stack_id.lower()}' style='display:flex; align-items:center; justify-content:space-between;'>
  <div>
    <span style='font-size:20px;'>{stack_cfg['icon']}</span>
    <strong style='color:{stack_color}; font-family:IBM Plex Mono; margin-left:10px;'>
      {stack_choice}
    </strong>
  </div>
  <span class='badge {badge_class}'>{stack_cfg['badge']}</span>
</div>
""", unsafe_allow_html=True)

# ─── INPUT ────────────────────────────────────────────────────────────────────
st.markdown("#### 📝 Describe Your Business Logic")

user_input = st.text_area(
    "Logic description",
    placeholder='e.g. "Return full name by concatenating first and last name with a space"',
    height=120,
    label_visibility="collapsed",
)

# Example chips
st.markdown("**💡 Quick Examples** — click to use:")
cols = st.columns(4)
for i, example in enumerate(EXAMPLES):
    with cols[i % 4]:
        short = example[:32] + "…" if len(example) > 32 else example
        if st.button(short, key=f"ex_{i}", use_container_width=True, help=example):
            st.session_state["prefill"] = example
            st.rerun()

# Apply prefill if set
if "prefill" in st.session_state:
    user_input = st.session_state.pop("prefill")

st.markdown("---")

# ─── GENERATE ────────────────────────────────────────────────────────────────
generate_col, _ = st.columns([1, 2])
with generate_col:
    generate_btn = st.button(
        f"⚡ Generate {stack_id} Code",
        disabled=not ollama_ok or not user_input.strip(),
        use_container_width=True,
    )

if not ollama_ok:
    st.warning("⚠️ Ollama is not running. Start it with: `OLLAMA_ORIGINS=* ollama serve`")

if generate_btn and user_input.strip() and ollama_ok:
    prompt = stack_cfg["template"] + user_input.strip()

    st.markdown(f"""
    <div class='bw-card bw-card-{stack_id.lower()}'>
      <div style='font-size:11px; color:{stack_color}; letter-spacing:2px; font-weight:700; margin-bottom:8px;'>
        {stack_cfg['icon']} {stack_id} OUTPUT — STREAMING
      </div>
    """, unsafe_allow_html=True)

    output_placeholder = st.empty()
    full_response = ""

    try:
        with st.spinner(f"Generating {stack_id} code..."):
            for token in stream_ollama(selected_model, CORE_SYSTEM_PROMPT, prompt):
                full_response += token
                output_placeholder.markdown(full_response + "▌")

        output_placeholder.markdown(full_response)
        st.session_state.last_output = full_response

        # Save to history
        st.session_state.history.insert(0, {
            "stack": stack_id,
            "input": user_input.strip(),
            "output": full_response,
            "model": selected_model,
            "timestamp": datetime.now().strftime("%H:%M:%S"),
        })

        st.success(f"✅ {stack_id} code generated successfully!")

        # Copy hint
        st.markdown(f"""
        <div style='background:#0d0d22; border:1px solid #1a1a3a; border-radius:8px;
          padding:10px 16px; font-size:11px; color:#6677aa; margin-top:8px;'>
          💾 Output saved to session history. Use the expander below to review past generations.
        </div>
        """, unsafe_allow_html=True)

    except requests.exceptions.ConnectionError:
        st.error("❌ Cannot connect to Ollama. Make sure it's running on localhost:11434")
    except Exception as e:
        st.error(f"❌ Error: {str(e)}")

    st.markdown("</div>", unsafe_allow_html=True)

elif st.session_state.last_output:
    st.markdown(f"""
    <div class='bw-card' style='opacity:0.7;'>
      <div style='font-size:11px; color:#556688; margin-bottom:8px;'>LAST OUTPUT</div>
    """, unsafe_allow_html=True)
    st.markdown(st.session_state.last_output)
    st.markdown("</div>", unsafe_allow_html=True)

# ─── HISTORY ─────────────────────────────────────────────────────────────────
if st.session_state.history:
    st.markdown("---")
    st.markdown("#### 🕐 Session History")

    for i, h in enumerate(st.session_state.history):
        h_color = "#00C2FF" if h["stack"] == "BW5" else "#FF6B35"
        with st.expander(
            f"{h['stack']}  ·  {h['timestamp']}  ·  {h['input'][:60]}{'…' if len(h['input'])>60 else ''}",
            expanded=(i == 0),
        ):
            col1, col2, col3 = st.columns([1, 1, 2])
            col1.markdown(f"**Stack:** `{h['stack']}`")
            col2.markdown(f"**Model:** `{h['model']}`")
            col3.markdown(f"**Time:** `{h['timestamp']}`")

            st.markdown(f"**Input:** _{h['input']}_")
            st.markdown("**Output:**")
            st.markdown(h["output"])

# ─── FOOTER ──────────────────────────────────────────────────────────────────
st.markdown("---")
st.markdown("""
<div style='text-align:center; color:#2a2a4a; font-size:10px; letter-spacing:2px; padding:10px 0;'>
  TIBCO HACKATHON 2025 · BW LOGIC AI GENERATOR · PYTHON + STREAMLIT + OLLAMA
</div>
""", unsafe_allow_html=True)
