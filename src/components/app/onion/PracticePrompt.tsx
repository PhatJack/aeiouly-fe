export interface PracticePromptProps {
  prompt: string;
  index: number;
}

export const PracticePrompt = ({ prompt, index }: PracticePromptProps) => (
  <div className="bg-muted/50 hover:bg-muted/70 flex items-start gap-3 rounded-lg p-4 transition-colors">
    <span className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium">
      {index + 1}
    </span>
    <p className="text-foreground leading-relaxed">{prompt}</p>
  </div>
);
