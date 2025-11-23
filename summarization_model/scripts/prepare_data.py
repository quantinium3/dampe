from datasets import load_dataset
from transformers import AutoTokenizer

def prepare_cnn_dailymail(output_dir: str = "data/processed"):
    """Load and preprocess CNN/DailyMail dataset."""
    print("Loading CNN/DailyMail dataset...")
    dataset = load_dataset("cnn_dailymail", "3.0.0")
    
    train_dataset = dataset["train"].select(range(10000))
    val_dataset = dataset["validation"].select(range(1000))
    
    print(f"Train samples: {len(train_dataset)}")
    print(f"Validation samples: {len(val_dataset)}")
    
    train_dataset.save_to_disk(f"{output_dir}/train")
    val_dataset.save_to_disk(f"{output_dir}/val")
    
    return train_dataset, val_dataset

def preprocess_function(examples, tokenizer, max_input_length=1024, max_target_length=256):
    """Tokenize inputs and targets."""
    # Add prompt prefix
    inputs = ["Summarize the following document in 2-3 concise paragraphs: " + doc 
              for doc in examples["article"]]
    
    model_inputs = tokenizer(
        inputs,
        max_length=max_input_length,
        truncation=True,
        padding="max_length"
    )
    
    # Tokenize targets
    labels = tokenizer(
        examples["highlights"],
        max_length=max_target_length,
        truncation=True,
        padding="max_length"
    )
    
    model_inputs["labels"] = labels["input_ids"]
    return model_inputs
