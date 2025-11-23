import torch
from transformers import (
    AutoModelForSeq2SeqLM,
    AutoTokenizer,
    Seq2SeqTrainingArguments,
    Seq2SeqTrainer,
    DataCollatorForSeq2Seq
)
from peft import LoraConfig, get_peft_model, TaskType
from datasets import load_from_disk
from prepare_data import prepare_cnn_dailymail, preprocess_function

def train_model():
    """Fine-tune FLAN-T5-Base with LoRA."""
    
    # Configuration
    model_name = "google/flan-t5-base"
    output_dir = "models/flan-t5-summarizer"
    data_dir = "data/processed"
    
    print(f"Loading model: {model_name}")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    
    # Configure LoRA
    lora_config = LoraConfig(
        r=8,  # LoRA rank
        lora_alpha=32,
        target_modules=["q", "v"],  # Attention layers
        lora_dropout=0.05,
        bias="none",
        task_type=TaskType.SEQ_2_SEQ_LM
    )
    
    print("Applying LoRA...")
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()
    
    # Load datasets
    print("Loading datasets...")
    train_dataset = load_from_disk(f"{data_dir}/train")
    val_dataset = load_from_disk(f"{data_dir}/val")
    
    # Preprocess
    train_dataset = train_dataset.map(
        lambda x: preprocess_function(x, tokenizer),
        batched=True,
        remove_columns=train_dataset.column_names
    )
    val_dataset = val_dataset.map(
        lambda x: preprocess_function(x, tokenizer),
        batched=True,
        remove_columns=val_dataset.column_names
    )
    
    # Data collator
    data_collator = DataCollatorForSeq2Seq(tokenizer, model=model)
    
    # Training arguments
    training_args = Seq2SeqTrainingArguments(
        output_dir=output_dir,
        num_train_epochs=3,
        per_device_train_batch_size=4,
        per_device_eval_batch_size=4,
        learning_rate=5e-5,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir=f"{output_dir}/logs",
        logging_steps=100,
        eval_strategy="steps",
        eval_steps=500,
        save_steps=500,
        save_total_limit=2,
        predict_with_generate=True,
        fp16=torch.cuda.is_available(),
        push_to_hub=False
    )
    
    # Trainer
    trainer = Seq2SeqTrainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        tokenizer=tokenizer,
        data_collator=data_collator
    )
    
    # Train
    print("Starting training...")
    trainer.train()
    
    # Save
    print(f"Saving model to {output_dir}")
    trainer.save_model()
    tokenizer.save_pretrained(output_dir)
    
    print("Training complete!")

if __name__ == "__main__":
    # First prepare data
    prepare_cnn_dailymail()
    # Then train
    train_model()
