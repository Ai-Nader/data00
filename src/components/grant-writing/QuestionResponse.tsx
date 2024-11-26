import { useState } from 'react';
import { Lightbulb, MessageSquare, ThumbsUp, AlertCircle } from 'lucide-react';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface QuestionResponseProps {
  questionId: string;
  questionText: string;
  questionType: 'short' | 'long' | 'numeric';
  wordLimit?: number;
}

// Simulated AI responses based on question categories and keywords
const getAIResponse = (question: string): { response: string; suggestions: string[] } => {
  const lowercaseQuestion = question.toLowerCase();
  
  if (lowercaseQuestion.includes('impact')) {
    return {
      response: "Our project will create 50 new jobs in the first year, primarily benefiting underserved communities. Initial assessments indicate a 30% improvement in local service accessibility. The economic multiplier effect is projected to generate $2M in additional local revenue through increased business activity and workforce development.",
      suggestions: [
        "Consider adding specific demographic impact data",
        "Include long-term sustainability metrics",
        "Quantify indirect community benefits"
      ]
    };
  }
  
  if (lowercaseQuestion.includes('budget')) {
    return {
      response: "The total requested budget is $250,000, allocated across three main categories: $150,000 for program implementation, $75,000 for staffing and training, and $25,000 for monitoring and evaluation. This allocation ensures optimal resource utilization while maintaining program quality.",
      suggestions: [
        "Break down implementation costs further",
        "Add cost-benefit analysis",
        "Include sustainability plan post-funding"
      ]
    };
  }
  
  if (lowercaseQuestion.includes('timeline')) {
    return {
      response: "The project will be executed over 18 months: Months 1-3: Initial setup and team recruitment; Months 4-9: Program implementation and community engagement; Months 10-15: Scaling and optimization; Months 16-18: Evaluation and reporting. Key milestones include quarterly impact assessments and stakeholder reviews.",
      suggestions: [
        "Add specific milestone dates",
        "Include risk mitigation timeframes",
        "Detail resource allocation timeline"
      ]
    };
  }
  
  return {
    response: "Based on our analysis and experience, we will implement a comprehensive approach that addresses key stakeholder needs while ensuring sustainable outcomes. Our methodology incorporates best practices and innovative solutions.",
    suggestions: [
      "Add more specific details",
      "Include measurable outcomes",
      "Consider adding examples"
    ]
  };
};

export function QuestionResponse({ questionId, questionText, questionType, wordLimit }: QuestionResponseProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handleGenerateResponse = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const { response: aiResponse, suggestions: aiSuggestions } = getAIResponse(questionText);
      setResponse(aiResponse);
      setSuggestions(aiSuggestions);
      setWordCount(aiResponse.split(/\s+/).length);
      setIsGenerating(false);
      setShowSuggestions(true);
    }, 1000);
  };

  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newResponse = e.target.value;
    setResponse(newResponse);
    setWordCount(newResponse.split(/\s+/).filter(Boolean).length);
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={handleGenerateResponse}
          disabled={isGenerating}
          icon={<MessageSquare className="h-4 w-4" />}
          variant="outline"
        >
          {isGenerating ? 'Generating...' : 'Generate Response'}
        </Button>
        
        {wordLimit && (
          <span className={cn(
            "text-sm",
            wordCount > wordLimit ? "text-red-500" : "text-gray-500 dark:text-gray-400"
          )}>
            {wordCount} / {wordLimit} words
          </span>
        )}
      </div>

      {response && (
        <div className="space-y-4">
          <Textarea
            value={response}
            onChange={handleResponseChange}
            rows={6}
            className="w-full"
            placeholder="Generated response will appear here..."
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className="bg-fundspoke-50 dark:bg-fundspoke-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="h-5 w-5 text-fundspoke-600 dark:text-fundspoke-400" />
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Suggestions for Improvement
                </h4>
              </div>
              <ul className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <ThumbsUp className="h-4 w-4 text-fundspoke-500 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {wordLimit && wordCount > wordLimit && (
            <div className="flex items-center space-x-2 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span>Response exceeds word limit by {wordCount - wordLimit} words</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}