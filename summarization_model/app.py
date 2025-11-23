from flask import Flask, request, jsonify
import os
import tempfile

app = Flask(__name__)

# Initialize model (lazy loading)
summarizer = None
pdf_extractor = PDFExtractor()

def get_summarizer():
    """Lazy load model."""
    global summarizer
    if summarizer is None:
        summarizer = Summarizer()
    return summarizer

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "model_loaded": summarizer is not None
    })

@app.route('/summarize', methods=['POST'])
def summarize():
    """Summarize PDF endpoint."""
    try:
        # Check file
        if 'pdf' not in request.files:
            return jsonify({"error": "No PDF file provided"}), 400
        
        file = request.files['pdf']
        if file.filename == '':
            return jsonify({"error": "Empty filename"}), 400
        
        # Save temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name
        
        try:
            # Extract text
            text = pdf_extractor.extract_text(tmp_path)
            
            if not text or len(text) < 50:
                return jsonify({"error": "Could not extract sufficient text from PDF"}), 400
            
            # Generate summary
            model = get_summarizer()
            summary = model.summarize(text)
            
            return jsonify({
                "summary": summary,
                "original_length": len(text),
                "summary_length": len(summary)
            })
        
        finally:
            # Cleanup
            os.unlink(tmp_path)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
