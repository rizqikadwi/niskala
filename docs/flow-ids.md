# Niskala — Flow IDs

## Development (Local)

| Flow | Nama | Flow ID | URL | Pemakaian |
| :--- | :--- | :--- | :--- | :--- |
| **A** | Niskala-UI | `<FLOW_ID_A>` | http://localhost:7860/flow/`<FLOW_ID_A>` | UI Globe |
| **B** | Niskala-Report | `<FLOW_ID_B>` | http://localhost:7860/flow/`<FLOW_ID_B>` | BOB / Playground |

## Production (Cloud)

| Flow | Nama | Flow ID | URL | Pemakaian |
| :--- | :--- | :--- | :--- | :--- |
| **A** | Niskala-UI | TBD | TBD | UI Globe |
| **B** | Niskala-Report | TBD | TBD | BOB / Playground |

## Cara Menggunakan

### Untuk UI Globe
- Buka `ui-globe/config.js`
- Pastikan `FLOW_ID` = Flow ID **Niskala-UI**

### Untuk Membaca Report
- Buka Langflow: `http://localhost:7860`
- Pilih flow **Niskala-Report**
- Klik **Playground** → **Run**
- Output: Markdown report yang enak dibaca