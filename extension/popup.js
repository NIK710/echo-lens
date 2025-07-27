// popup.js
const backendBaseUrl = "https://echo-lens-backend.onrender.com";

function getRedditUrl(tab) {
  const url = tab.url;
  return url.includes("reddit.com") ? url : null;
}

function cleanMarkdownFormatting(text) {
  // Remove double asterisks (bold markdown)
  return text.replace(/\*\*(.*?)\*\*/g, '$1').trim();
}

function parseAnalysisIntoSections(text) {
  // Parse text that has numbered sections like "1. Header: content"
  const sections = [];
  
  // Split by numbered sections (1., 2., 3., 4.)
  const sectionRegex = /(?:^|\n)\s*(\d+)\s*\.\s*([^:]+):\s*([\s\S]*?)(?=\n\s*\d+\s*\.|$)/g;
  let match;
  
  while ((match = sectionRegex.exec(text)) !== null) {
    const [, number, header, content] = match;
    sections.push({
      number: parseInt(number),
      header: cleanMarkdownFormatting(header.trim()),
      content: cleanMarkdownFormatting(content.trim())
    });
  }
  
  // If no numbered sections found, try alternative parsing
  if (sections.length === 0) {
    // Try parsing sections separated by double newlines or clear headers
    const lines = text.split('\n');
    let currentSection = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // Check if line looks like a header (contains colon or is all caps)
      if (trimmedLine.includes(':') && trimmedLine.length < 100) {
        if (currentSection) {
          sections.push(currentSection);
        }
        const [header, ...contentParts] = trimmedLine.split(':');
        currentSection = {
          number: sections.length + 1,
          header: cleanMarkdownFormatting(header.trim()),
          content: cleanMarkdownFormatting(contentParts.join(':').trim())
        };
      } else if (currentSection) {
        currentSection.content += (currentSection.content ? '\n' : '') + trimmedLine;
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }
  }
  
  return sections;
}

function createAnalysisCard(section) {
  const card = document.createElement('div');
  card.className = 'analysis-card';
  
  const header = document.createElement('div');
  header.className = 'card-header';
  header.textContent = section.header;
  
  const content = document.createElement('div');
  content.className = 'card-content';
  content.textContent = section.content;
  
  card.appendChild(header);
  card.appendChild(content);
  
  return card;
}

function showAnalysis(text) {
  const statusElement = document.getElementById("status");
  const resultElement = document.getElementById("result");
  
  statusElement.textContent = "Analysis complete";
  statusElement.style.display = "none"; // Hide status after completion
  
  // Clear previous results
  resultElement.innerHTML = '';
  
  // Parse the analysis into sections
  const sections = parseAnalysisIntoSections(text);
  
  if (sections.length === 0) {
    // Fallback: display as single card if parsing fails
    const fallbackCard = document.createElement('div');
    fallbackCard.className = 'analysis-card';
    
    const header = document.createElement('div');
    header.className = 'card-header';
    header.textContent = 'Analysis Results';
    
    const content = document.createElement('div');
    content.className = 'card-content';
    content.textContent = text;
    
    fallbackCard.appendChild(header);
    fallbackCard.appendChild(content);
    resultElement.appendChild(fallbackCard);
  } else {
    // Create cards for each section
    sections.forEach(section => {
      const card = createAnalysisCard(section);
      resultElement.appendChild(card);
    });
  }
}

function showError(message) {
  const statusElement = document.getElementById("status");
  const resultElement = document.getElementById("result");
  
  statusElement.style.display = "none";
  resultElement.innerHTML = `<div class="error">${message}</div>`;
}

function showLoading() {
  const statusElement = document.getElementById("status");
  statusElement.innerHTML = '<div class="loading"><div class="spinner"></div>Analyzing Reddit thread...</div>';
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const redditUrl = getRedditUrl(tabs[0]);

  if (!redditUrl) {
    showError("Not a Reddit thread. Open a Reddit thread and try again.");
    return;
  }

  showLoading();

  fetch(`${backendBaseUrl}/analyze?url=${encodeURIComponent(redditUrl)}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      const analysis = data.gemini_analysis || data.analysis || "No analysis returned.";
      showAnalysis(analysis);
    })
    .catch((err) => {
      console.error('Analysis error:', err);
      showError(`Error fetching analysis: ${err.message}`);
    });
});

