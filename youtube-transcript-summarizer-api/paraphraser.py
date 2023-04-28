from transformers import BertTokenizer, BertModel

# def paraphraseText(text):
model = BertModel.from_pretrained('bert-base-uncased')
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
input_text = "The quick brown fox jumps over the lazy dog."
input_ids = tokenizer.encode(input_text, return_tensors="pt")
outputs = model.generate(input_ids)
output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

# Print the paraphrased text
print(output_text)