from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from peft import PeftModel
import torch

class Summarizer:
    def __init__(self, model_path: str = "models/flan-t5-summarizer"):
        """Load fine-tuned model."""
        print(f"Loading model from {model_path}...")
        
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        
        # Load base model and apply LoRA weights
        base_model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")
        self.model = PeftModel.from_pretrained(base_model, model_path)
        self.model.to(self.device)
        self.model.eval()
        
        print(f"Model loaded on {self.device}")
    
    def summarize(self, text: str, max_length: int = 300) -> str:
        """Generate summary from text."""
        # Add prompt
        prompt = f"Summarize the following document in 2-3 concise paragraphs: {text}"
        
        # Tokenize
        inputs = self.tokenizer(
            prompt,
            max_length=1024,
            truncation=True,
            return_tensors="pt"
        ).to(self.device)
        
        # Generate
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=max_length,
                temperature=0.3,
                top_p=0.9,
                do_sample=True,
                num_beams=4,
                early_stopping=True
            )
        
        # Decode
        summary = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return summary.strip()
