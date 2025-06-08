// CommunityItem.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimeConvert } from '../../../hooks/useTimeConvert';

interface Post {
  boardId: number;
  createAt: string;
  title: string;
  userId: string;
  content: string;
  userNickName: string;
}

interface CommunityItemProps {
  post: Post;
}

const CommunityItem: React.FC<CommunityItemProps> = ({ post }) => {
  const navigate = useNavigate();
  const convertedTime = useTimeConvert(post.createAt) || '';

  return (
    <div
      className="flex justify-between items-center w-full p-4 py-4 border-b border-gray-300 cursor-pointer hover:bg-[#ECF1EF]"
      onClick={() => navigate(`/community/post/${post.boardId}`, { state: { post } })}
    >
      <div>
        <p className="text-start text-sm font-semibold mt-1">{post.title}</p>
        <p className="text-sm text-left text-gray-500 mt-3 mb-2">
          {post.userNickName} | {convertedTime}
        </p>
      </div>
      <span className="text-gray-400 text-4xl">›</span>
    </div>
  );
};

export default CommunityItem;
