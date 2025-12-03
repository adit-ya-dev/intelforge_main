"use client";

import { useState } from "react";
import { Comment } from "@/types/tech-detail";
import {
  MessageSquare,
  Pin,
  Reply,
  MoreVertical,
  Send,
  Paperclip,
  AtSign,
  Smile,
} from "lucide-react";

interface NotesCollaborationProps {
  comments: Comment[];
  techId: string;
}

export default function NotesCollaboration({
  comments: initialComments,
  techId,
}: NotesCollaborationProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        userId: "current-user",
        userName: "You",
        userAvatar: "YU",
        content: newComment,
        createdAt: new Date().toISOString(),
        isPinned: false,
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const handleAddReply = (parentId: string) => {
    if (replyText.trim()) {
      const reply: Comment = {
        id: `reply-${Date.now()}`,
        userId: "current-user",
        userName: "You",
        userAvatar: "YU",
        content: replyText,
        createdAt: new Date().toISOString(),
        isPinned: false,
      };

      setComments(
        comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), reply],
            };
          }
          return comment;
        })
      );
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const togglePin = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, isPinned: !comment.isPinned };
        }
        return comment;
      })
    );
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
  };

  // Separate pinned and regular comments
  const pinnedComments = comments.filter((c) => c.isPinned);
  const regularComments = comments.filter((c) => !c.isPinned);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Notes & Collaboration
          </h2>
          <p className="text-sm text-muted-foreground">
            {comments.length} comments • {pinnedComments.length} pinned
          </p>
        </div>
      </div>

      {/* New Comment Input */}
      <div className="mb-6">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment or annotation..."
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={3}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-md hover:bg-muted transition-colors"
                title="Attach file"
              >
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                className="p-2 rounded-md hover:bg-muted transition-colors"
                title="Mention someone"
              >
                <AtSign className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                className="p-2 rounded-md hover:bg-muted transition-colors"
                title="Add emoji"
              >
                <Smile className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                newComment.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              <Send className="h-4 w-4" />
              Comment
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {/* Pinned Comments */}
        {pinnedComments.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Pin className="h-4 w-4 text-primary" />
              Pinned Comments
            </h3>
            {pinnedComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onTogglePin={togglePin}
                onReply={setReplyingTo}
                replyingTo={replyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                onAddReply={handleAddReply}
                formatTimeAgo={formatTimeAgo}
              />
            ))}
          </div>
        )}

        {/* Regular Comments */}
        {pinnedComments.length > 0 && regularComments.length > 0 && (
          <div className="border-t border-border my-4" />
        )}

        {regularComments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onTogglePin={togglePin}
            onReply={setReplyingTo}
            replyingTo={replyingTo}
            replyText={replyText}
            setReplyText={setReplyText}
            onAddReply={handleAddReply}
            formatTimeAgo={formatTimeAgo}
          />
        ))}

        {comments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-2">No comments yet</p>
            <p className="text-sm text-muted-foreground">
              Be the first to add a comment or annotation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface CommentCardProps {
  comment: Comment;
  onTogglePin: (id: string) => void;
  onReply: (id: string | null) => void;
  replyingTo: string | null;
  replyText: string;
  setReplyText: (text: string) => void;
  onAddReply: (parentId: string) => void;
  formatTimeAgo: (date: string) => string;
}

function CommentCard({
  comment,
  onTogglePin,
  onReply,
  replyingTo,
  replyText,
  setReplyText,
  onAddReply,
  formatTimeAgo,
}: CommentCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={`p-4 rounded-lg border transition-colors ${
        comment.isPinned
          ? "bg-primary/5 border-primary/30"
          : "bg-card border-border"
      }`}
    >
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-medium text-sm">
            {comment.userAvatar}
          </div>
          <div>
            <div className="font-medium text-foreground">{comment.userName}</div>
            <div className="text-xs text-muted-foreground">
              {formatTimeAgo(comment.createdAt)}
              {comment.updatedAt && " (edited)"}
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-popover border border-border rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  onTogglePin(comment.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Pin className="h-3 w-3" />
                {comment.isPinned ? "Unpin" : "Pin"}
              </button>
              <button className="w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors">
                Edit
              </button>
              <button className="w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors text-red-500">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comment Content */}
      <div className="text-sm text-foreground mb-3">{comment.content}</div>

      {/* Attached Sources */}
      {comment.attachedSourceIds && comment.attachedSourceIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {comment.attachedSourceIds.map((sourceId) => (
            <span
              key={sourceId}
              className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded border border-border"
            >
              📎 {sourceId}
            </span>
          ))}
        </div>
      )}

      {/* Comment Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-border">
        <button
          onClick={() => onReply(comment.id)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Reply className="h-3 w-3" />
          Reply
        </button>
      </div>

      {/* Reply Input */}
      {replyingTo === comment.id && (
        <div className="mt-3 pl-4 border-l-2 border-primary">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={2}
          />
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              onClick={() => onReply(null)}
              className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onAddReply(comment.id)}
              disabled={!replyText.trim()}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                replyText.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Reply
            </button>
          </div>
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 pl-4 border-l-2 border-border space-y-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-xs">
                  {reply.userAvatar}
                </div>
                <div>
                  <div className="font-medium text-foreground text-sm">
                    {reply.userName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTimeAgo(reply.createdAt)}
                  </div>
                </div>
              </div>
              <div className="text-sm text-foreground">{reply.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}