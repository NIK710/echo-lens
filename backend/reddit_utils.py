import praw
import os
from dotenv import load_dotenv

load_dotenv()

reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent="echo-lens-script"
)

def fetch_reddit_thread(url):
    submission = reddit.submission(url=url)
    submission.comments.replace_more(limit=0)
    all_comments = [comment.body for comment in submission.comments.list()]
    return all_comments
