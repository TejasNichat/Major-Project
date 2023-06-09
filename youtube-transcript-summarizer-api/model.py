from nltk.corpus import stopwords
from heapq import nlargest
import re
import nltk
import spacy
from string import punctuation
from transcript import get_transcript_of_yt_video
from translate import g_translate
from download import makeTextFile

nltk.download('stopwords')

nlp = spacy.load('en_core_web_sm')
stop_words = set(stopwords.words('english'))

def text_summarizer(text):
    print("Summarizing")

    doc = nlp(text)

    word_frequencies = {}
    for word in doc:
        if word.text.lower() not in stop_words and word.text.lower() not in punctuation:
            if word.text not in word_frequencies:
                word_frequencies[word.text] = 1
            else:
                word_frequencies[word.text] += 1

    max_frequency = max(word_frequencies.values())
    for word in word_frequencies:
        word_frequencies[word] /= max_frequency

    sentence_tokens = list(doc.sents)

    sentence_scores = {}
    for sent in sentence_tokens:
        for word in sent:
            if word.text.lower() in word_frequencies:
                if sent not in sentence_scores:
                    sentence_scores[sent] = word_frequencies[word.text.lower()]
                else:
                    sentence_scores[sent] += word_frequencies[word.text.lower()]

    select_length = int(len(sentence_tokens)*0.3)
    summary = nlargest(select_length, sentence_scores, key=sentence_scores.get)

    summary = [re.sub('[.]', '', (word.text).replace(
        "\n", ",").strip()).capitalize() for word in summary]
    final_text = '. '.join(summary)

    final_summary = re.sub(',,|,\.|,\-|[\"]', '', final_text)

    return final_summary


def nlp_model(v_id):
    print("starting model getting transcript")

    transcript = get_transcript_of_yt_video(v_id)
    print("got transcript processing now")

    if (transcript == '0'):
        return '0'

    transcript_size = len(transcript)
    original_text = ' '.join(t['text'] for t in transcript)
    original_text_length = len(original_text)

    s_t = []
    result = ""

    for txt in range(transcript_size):
        result += ' ' + transcript[txt]['text']
        if (txt + 1) % 100 == 0 or txt == transcript_size - 1:
            s_t.append(text_summarizer(result))
            result = ""

    english_summary = ' '.join(s_t) + '.'

    final_summary_length = len(english_summary)

    hindi_translated_summary = g_translate(english_summary, 'hi')
    gujarati_translated_summary = g_translate(english_summary, 'gu')

    makeTextFile("English", english_summary)
    makeTextFile("Hindi", hindi_translated_summary)
    makeTextFile("Gujarati", gujarati_translated_summary)

    return original_text_length, final_summary_length, english_summary, hindi_translated_summary, gujarati_translated_summary
