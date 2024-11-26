export function processClientMessage(message: string, clientName: string): string {
  const normalizedMessage = message.toLowerCase();

  // Email-related queries
  if (normalizedMessage.includes('email') || normalizedMessage.includes('mail')) {
    return `Searching ${clientName}'s email communications...
Found 3 recent email threads:
1. "Q4 Investment Review" - 2 days ago
2. "Portfolio Update" - 1 week ago
3. "Meeting Follow-up" - 2 weeks ago`;
  }

  // Report-related queries
  if (normalizedMessage.includes('report')) {
    return `Searching ${clientName}'s reports...
Found 2 recent reports:
1. "Annual Performance Review 2024" - Generated Jan 15, 2024
2. "Q4 2023 Investment Summary" - Generated Dec 30, 2023`;
  }

  // Meeting-related queries
  if (normalizedMessage.includes('meeting')) {
    return `Searching ${clientName}'s meeting records...
Found 2 recent meetings:
1. "Strategy Review" - Jan 10, 2024
2. "Portfolio Planning" - Dec 20, 2023`;
  }

  // General information query
  if (normalizedMessage.includes('information') || normalizedMessage.includes('details')) {
    return `Here's ${clientName}'s general information:
• Client since: January 2020
• Portfolio Value: $2.5M
• Last Contact: 3 days ago
• Preferred Contact Method: Email
• Risk Profile: Moderate`;
  }

  // Default response
  return `I can help you find information about ${clientName}. Try asking about:
• Recent emails or communications
• Reports and documents
• Meeting notes and schedules
• General client information`;
}

export function processGlobalMessage(message: string): string {
  const normalizedMessage = message.toLowerCase();

  // Email-related queries
  if (normalizedMessage.includes('email') || normalizedMessage.includes('mail')) {
    return `Searching all email communications...
Found 5 recent email threads across all clients:
1. "Q4 Investment Review" - Client A - 2 days ago
2. "Portfolio Update" - Client B - 1 week ago
3. "Meeting Follow-up" - Client C - 2 weeks ago
4. "Risk Assessment" - Client D - 3 days ago
5. "Investment Strategy" - Client E - 1 day ago`;
  }

  // Report-related queries
  if (normalizedMessage.includes('report')) {
    return `Searching all reports...
Found 4 recent reports:
1. "Annual Performance Review 2024" - Client A - Jan 15, 2024
2. "Q4 2023 Investment Summary" - Client B - Dec 30, 2023
3. "Risk Analysis Report" - Client C - Jan 20, 2024
4. "Portfolio Performance" - Client D - Jan 25, 2024`;
  }

  // Meeting-related queries
  if (normalizedMessage.includes('meeting')) {
    return `Searching all meeting records...
Found 3 recent meetings:
1. "Strategy Review" - Client A - Jan 10, 2024
2. "Portfolio Planning" - Client B - Dec 20, 2023
3. "Investment Discussion" - Client C - Jan 5, 2024`;
  }

  // Client-related queries
  if (normalizedMessage.includes('client')) {
    return `Found 5 active clients:
1. Client A - Portfolio: $2.5M
2. Client B - Portfolio: $1.8M
3. Client C - Portfolio: $3.2M
4. Client D - Portfolio: $2.1M
5. Client E - Portfolio: $4.5M`;
  }

  // Default response
  return `I can help you search across all client data. Try asking about:
• All email communications
• All reports and documents
• All meeting notes and schedules
• Client information and portfolios
• Specific client names or details`;
}