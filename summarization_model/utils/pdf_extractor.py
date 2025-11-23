import re
import PyPDF2
from typing import Optional

class PDFExtractor:
    @staticmethod
    def extract_text(pdf_path: str) -> str:
        """Extract and clean text from PDF."""
        text = ""
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text()
        
        # Clean text
        text = PDFExtractor._clean_text(text)
        return text
    
    @staticmethod
    def _clean_text(text: str) -> str:
        """Remove noise from extracted text."""
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'\n\d+\n', '\n', text)
        text = re.sub(r'Page \d+ of \d+', '', text, flags=re.IGNORECASE)
        text = text.strip()
        return text
