# Setup Instructions

## Environment Variables

Before running the project, set your Gemini API key:

### Windows (PowerShell)
```powershell
$env:GEMINI_API_KEY="your-actual-api-key-here"
```

### Windows (Command Prompt)
```cmd
set GEMINI_API_KEY=your-actual-api-key-here
```

### Linux/Mac
```bash
export GEMINI_API_KEY=your-actual-api-key-here
```

## Or use .env file

Create `backend/.env`:
```
GEMINI_API_KEY=your-actual-api-key-here
```

## Run the Project

```bash
cd backend
pip install -r requirements.txt
python test_agents.py
```
