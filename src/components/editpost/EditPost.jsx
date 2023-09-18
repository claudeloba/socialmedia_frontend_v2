import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../api.js";

const EditPost = ({ post, onFinishEdit }) => {
  const [desc, setDesc] = useState(post.desc);

  const queryClient = useQueryClient();

  const editMutation = useMutation(
    () => makeRequest.put("/posts/" + post.id, { desc }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
        onFinishEdit();
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    editMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      ></textarea>
      <button type="submit">Save</button>
      <button type="button" onClick={onFinishEdit}>
        Cancel
      </button>
    </form>
  );
};

export default EditPost;
