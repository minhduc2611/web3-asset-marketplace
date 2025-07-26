"use client"
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Save, MoreHorizontal } from 'lucide-react';
import { toast } from "sonner"

interface HighlightPosition {
  x: number;
  y: number;
  selectedText: string;
}

export default function GlobalTextHighlighter() {
  const [highlightPosition, setHighlightPosition] = useState<HighlightPosition | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Ensure component is mounted before rendering portals
  useEffect(() => {
    setMounted(true);
  }, []);

  const saveTextToMemory = (text: string) => {
    try {
      const savedTexts = JSON.parse(localStorage.getItem('highlightedTexts') || '[]');
      const newEntry = {
        id: Date.now().toString(),
        text: text.trim(),
        timestamp: new Date().toISOString(),
        source: 'global-text-selection'
      };
      
      savedTexts.push(newEntry);
      localStorage.setItem('highlightedTexts', JSON.stringify(savedTexts));
      
      toast.success("Text saved to memory", {
        description: `"${text.length > 50 ? text.substring(0, 50) + '...' : text}" has been saved locally.`,
      });
    } catch {
      toast.error("Error saving text", {
        description: "Failed to save text to local storage.",
      });
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length === 0) {
      setHighlightPosition(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Use screen-relative positioning for better accuracy
    const x = rect.left + (rect.width / 2);
    const y = rect.top - 45;
    
    // Ensure the button stays within viewport bounds
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const finalX = Math.max(30, Math.min(x, viewportWidth - 30));
    const finalY = Math.max(10, Math.min(y, viewportHeight - 60));
    
    setHighlightPosition({
      x: finalX,
      y: finalY,
      selectedText
    });

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Auto-hide the highlight button after 7 seconds
    timeoutRef.current = setTimeout(() => {
      setHighlightPosition(null);
    }, 7000);
  };

  const handleContextMenu = (e: Event) => {
    const mouseEvent = e as MouseEvent;
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length === 0) return;

    mouseEvent.preventDefault();
    
    // Use screen-relative positioning for context menu
    const x = mouseEvent.clientX;
    const y = mouseEvent.clientY;
    
    // Ensure context menu stays within viewport bounds
    const finalX = Math.max(10, Math.min(x, window.innerWidth - 200));
    const finalY = Math.max(10, Math.min(y, window.innerHeight - 100));
    
    setContextMenuPosition({ x: finalX, y: finalY });
    setShowContextMenu(true);
  };

  const handleClickOutside = () => {
    setHighlightPosition(null);
    setShowContextMenu(false);
  };

  useEffect(() => {
    const mouseUpHandler = () => handleTextSelection();
    const contextMenuHandler = (e: Event) => handleContextMenu(e);
    const clickHandler = () => handleClickOutside();
    
    document.addEventListener('mouseup', mouseUpHandler);
    document.addEventListener('contextmenu', contextMenuHandler);
    document.addEventListener('click', clickHandler);
    
    return () => {
      document.removeEventListener('mouseup', mouseUpHandler);
      document.removeEventListener('contextmenu', contextMenuHandler);
      document.removeEventListener('click', clickHandler);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Don't render anything until mounted (prevents SSR issues)
  if (!mounted) return null;

  return (
    <>
      {/* Floating highlight button - only shows when text is selected */}
      {highlightPosition && createPortal(
        <div
          className="absolute z-50 animate-in fade-in-0 zoom-in-95 pointer-events-auto"
          style={{
            left: highlightPosition.x,
            top: highlightPosition.y,
            transform: 'translateX(-50%)',
            position: 'fixed'
          }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="default"
                className="h-8 w-8 p-0 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  saveTextToMemory(highlightPosition.selectedText);
                  setHighlightPosition(null);
                }}
                className="cursor-pointer"
              >
                <Save className="mr-2 h-4 w-4" />
                Add text into memory
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>,
        document.body
      )}

      {/* Context menu - only shows when right-clicking on selected text */}
      {showContextMenu && createPortal(
        <div
          className="fixed z-50 animate-in fade-in-0 zoom-in-95 pointer-events-auto"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y
          }}
        >
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md shadow-lg py-1 min-w-48">
            <button
              onClick={() => {
                const selection = window.getSelection();
                if (selection) {
                  saveTextToMemory(selection.toString());
                }
                setShowContextMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 flex items-center cursor-pointer"
            >
              <Save className="mr-2 h-4 w-4" />
              Add text into memory
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
} 