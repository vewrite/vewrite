import TurndownService from 'turndown';

export function convertToAsciidoc(html) {
  // First convert to markdown using Turndown
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
  })
  
  // Add some custom rules for better Markdown conversion
  turndownService.addRule('multipleLineBreaks', {
    filter: (node, options) => {
      return node.nodeName === 'BR' && node.previousSibling && node.previousSibling.nodeName === 'BR'
    },
    replacement: (content, node) => '\n\n'
  })

  // Convert HTML to Markdown first
  const markdown = turndownService.turndown(html)
  
  // Then convert Markdown to AsciiDoc
  return markdownToAsciidoc(markdown)
}

function markdownToAsciidoc(markdown) {
  let asciidoc = markdown

  // Headers
  asciidoc = asciidoc.replace(/^# (.*?)$/gm, '= $1')
  asciidoc = asciidoc.replace(/^## (.*?)$/gm, '== $1')
  asciidoc = asciidoc.replace(/^### (.*?)$/gm, '=== $1')
  asciidoc = asciidoc.replace(/^#### (.*?)$/gm, '==== $1')
  asciidoc = asciidoc.replace(/^##### (.*?)$/gm, '===== $1')
  asciidoc = asciidoc.replace(/^###### (.*?)$/gm, '====== $1')

  // Bold and Italic
  asciidoc = asciidoc.replace(/\*\*(.*?)\*\*/g, '*$1*')
  asciidoc = asciidoc.replace(/\*(.*?)\*/g, '_$1_')
  
  // Code blocks
  asciidoc = asciidoc.replace(/```(\w*)\n([\s\S]*?)```/g, '[source,$1]\n----\n$2----\n')
  
  // Inline code
  asciidoc = asciidoc.replace(/`([^`]+)`/g, '`$1`')
  
  // Lists
  // Ordered lists in AsciiDoc use periods instead of parentheses
  asciidoc = asciidoc.replace(/^\d+\. (.*?)$/gm, '. $1')
  // Unordered lists can use asterisks as well, but we'll standardize on dashes
  asciidoc = asciidoc.replace(/^\* (.*?)$/gm, '* $1')
  
  // Links
  asciidoc = asciidoc.replace(/\[(.*?)\]\((.*?)\)/g, 'link:$2[$1]')
  
  // Images
  asciidoc = asciidoc.replace(/!\[(.*?)\]\((.*?)\)/g, 'image::$2[$1]')
  
  // Blockquotes
  asciidoc = asciidoc.replace(/^> (.*?)$/gm, '[quote]\n____\n$1\n____\n')
  
  // Horizontal rules
  asciidoc = asciidoc.replace(/^---$/gm, "'''\n")
  
  // Tables need more complex handling
  // This is a simplistic approach; complex tables may need manual adjustment
  asciidoc = asciidoc.replace(/\|([^|\n]+)\|/g, '|$1|')
  
  return asciidoc
}

// Export plugin module
export default {
  install: (app) => {
    app.config.globalProperties.$asciidoc = convertToAsciidoc
  }
}