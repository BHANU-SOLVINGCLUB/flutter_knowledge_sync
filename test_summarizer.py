#!/usr/bin/env python3
"""
Test the Gemini summarization feature
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.summarizer import summarize_text
import logging

logging.basicConfig(level=logging.INFO)
LOG = logging.getLogger(__name__)

def test_summarizer():
    """Test the Gemini summarization"""
    LOG.info("🧠 Testing Gemini summarization...")
    
    test_text = """
    Flutter is Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase. 
    It uses the Dart programming language and provides a rich set of pre-designed widgets that follow platform-specific design guidelines.
    Flutter's hot reload feature allows developers to see changes instantly during development, making it highly productive for building user interfaces.
    The framework includes a comprehensive set of widgets for building complex layouts, handling user input, and managing application state.
    """
    
    try:
        summary = summarize_text(test_text, max_tokens=100)
        LOG.info("✅ Summarization successful!")
        LOG.info(f"Original text length: {len(test_text)} characters")
        LOG.info(f"Summary length: {len(summary)} characters")
        LOG.info(f"Summary: {summary}")
    except Exception as e:
        LOG.exception("❌ Summarization failed: %s", e)

if __name__ == "__main__":
    test_summarizer()
