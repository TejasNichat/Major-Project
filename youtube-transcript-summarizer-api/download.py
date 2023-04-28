def makeTextFile(name, content):
    # file = open(f"../youtube-transcript-summarizer-frontend/src/transcripts/{name}.txt","w",encoding="utf-8")
    try:
        with open(f"../youtube-transcript-summarizer-frontend/src/transcripts/{name}.txt","w",encoding="utf-8") as f:
            f.write(f"{name} Transcript:\n{content}")
    except Exception as e:
        print (e)


