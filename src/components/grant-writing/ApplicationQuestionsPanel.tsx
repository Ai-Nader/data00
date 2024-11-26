import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { QuestionResponse } from './QuestionResponse';
import { cn } from '../../lib/utils';

interface Question {
  id: string;
  text: string;
  type: 'short' | 'long' | 'numeric';
  category: 'impact' | 'budget' | 'timeline' | 'general';
  required: boolean;
  wordLimit?: number;
}

const defaultQuestions: Question[] = [
  {
    id: '1',
    text: "Describe the project's impact on the community",
    type: 'long',
    category: 'impact',
    required: true,
    wordLimit: 500,
  },
  {
    id: '2',
    text: 'What is the total budget requested?',
    type: 'numeric',
    category: 'budget',
    required: true,
  },
  {
    id: '3',
    text: 'Outline the project timeline and key milestones',
    type: 'long',
    category: 'timeline',
    required: true,
    wordLimit: 300,
  },
];

export function ApplicationQuestionsPanel() {
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'short',
    category: 'general',
    required: false,
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddQuestion = () => {
    if (!newQuestion.text?.trim()) return;

    const question: Question = {
      id: Date.now().toString(),
      text: newQuestion.text,
      type: newQuestion.type || 'short',
      category: newQuestion.category || 'general',
      required: newQuestion.required || false,
      wordLimit: newQuestion.wordLimit,
    };

    setQuestions([...questions, question]);
    setNewQuestion({
      type: 'short',
      category: 'general',
      required: false,
    });
    setIsAddingNew(false);
  };

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const QuestionForm = ({ question, onSave, onCancel }: {
    question: Partial<Question>;
    onSave: (question: Partial<Question>) => void;
    onCancel: () => void;
  }) => (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Question Text
        </label>
        <Textarea
          value={question.text || ''}
          onChange={(e) => onSave({ ...question, text: e.target.value })}
          placeholder="Enter question text"
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            value={question.type}
            onChange={(e) => onSave({ ...question, type: e.target.value as Question['type'] })}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <option value="short">Short Answer</option>
            <option value="long">Long Answer</option>
            <option value="numeric">Numeric</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            value={question.category}
            onChange={(e) => onSave({ ...question, category: e.target.value as Question['category'] })}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <option value="general">General</option>
            <option value="impact">Impact</option>
            <option value="budget">Budget</option>
            <option value="timeline">Timeline</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onSave({ ...question, required: e.target.checked })}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Required</span>
        </label>

        {question.type === 'long' && (
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Word Limit:
            </label>
            <Input
              type="number"
              value={question.wordLimit || ''}
              onChange={(e) => onSave({ ...question, wordLimit: parseInt(e.target.value) || undefined })}
              className="w-24"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(question)}>
          Save Question
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Application Questions
          </h2>
          <Button
            onClick={() => setIsAddingNew(true)}
            icon={<Plus className="h-4 w-4" />}
            disabled={isAddingNew}
          >
            Add Question
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {isAddingNew && (
          <QuestionForm
            question={newQuestion}
            onSave={(updates) => {
              setNewQuestion(updates);
              if (updates.text?.trim()) {
                handleAddQuestion();
              }
            }}
            onCancel={() => {
              setIsAddingNew(false);
              setNewQuestion({
                type: 'short',
                category: 'general',
                required: false,
              });
            }}
          />
        )}

        {questions.map((question) => (
          <div
            key={question.id}
            className={cn(
              "p-4 rounded-lg border",
              editingId === question.id
                ? "border-fundspoke-500 dark:border-fundspoke-400"
                : "border-gray-200 dark:border-gray-700"
            )}
          >
            {editingId === question.id ? (
              <QuestionForm
                question={question}
                onSave={(updates) => {
                  handleUpdateQuestion(question.id, updates);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-gray-900 dark:text-white">
                        {question.text}
                        {question.required && (
                          <span className="ml-1 text-red-500">*</span>
                        )}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                          {
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                              question.category === 'general',
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                              question.category === 'impact',
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                              question.category === 'budget',
                            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200':
                              question.category === 'timeline',
                          }
                        )}>
                          {question.category.charAt(0).toUpperCase() + question.category.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {question.type === 'short' && 'Short Answer'}
                          {question.type === 'long' && `Long Answer ${question.wordLimit ? `(${question.wordLimit} words)` : ''}`}
                          {question.type === 'numeric' && 'Numeric'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingId(question.id)}
                        className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <QuestionResponse
                  questionId={question.id}
                  questionText={question.text}
                  questionType={question.type}
                  wordLimit={question.wordLimit}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}