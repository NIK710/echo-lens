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
    # Only expand the top-level comments, don't load "more comments"
    submission.comments.replace_more(limit=0)
    
    # Get top 10 comments (sorted by Reddit's default sorting which is usually "best")
    top_comments = []
    for comment in submission.comments[:10]:  # Limit to first 10 comments
        if hasattr(comment, 'body') and comment.body != '[deleted]' and comment.body != '[removed]':
            top_comments.append(comment.body)
    
    return top_comments
