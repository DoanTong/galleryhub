import "./createPage.css";
import IKImage from "../../components/image/image";
import useAuthStore from "../../utils/authStore";
import { useNavigate, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import Editor from "../../components/editor/editor";
import useEditorStore from "../../utils/editorStore";
import apiRequest from "../../utils/apiRequest";
import { useMutation, useQuery } from "@tanstack/react-query";
import BoardForm from "./BoardForm";

const addPost = async (post) => {
  const res = await apiRequest.post("/pins", post, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return res.data;
};

const updatePost = async ({ id, data }) => {
  const res = await apiRequest.put(`/pins/${id}`, data, {
    withCredentials: true,
  });
  return res.data;
};

const CreatePage = () => {
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();
  const { id } = useParams(); // nếu có id => edit mode
  const formRef = useRef();
  const { textOptions, canvasOptions, resetStore } = useEditorStore();

  const [file, setFile] = useState(null);
  const [previewImg, setPreviewImg] = useState({
    url: "",
    width: 0,
    height: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newBoard, setNewBoard] = useState("");
  const [isNewBoardOpen, setIsNewBoardOpen] = useState(false);

  // --- Nếu chưa login thì redirect ---
  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    }
  }, [navigate, currentUser]);

  // --- Preview file ---
  useEffect(() => {
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setPreviewImg({
          url: URL.createObjectURL(file),
          width: img.width,
          height: img.height,
        });
      };
    }
  }, [file]);

  // --- Nếu là edit thì fetch pin hiện có ---
  useEffect(() => {
    if (id) {
      const fetchPin = async () => {
        const res = await apiRequest.get(`/pins/${id}`);
        if (res.status === 200) {
          const data = res.data;
          // gán dữ liệu vào form
          if (formRef.current) {
            formRef.current.title.value = data.title || "";
            formRef.current.description.value = data.description || "";
            formRef.current.link.value = data.link || "";
            formRef.current.tags.value = data.tags?.join(", ") || "";
          }
          setPreviewImg({
            url: pin.media,
            width: data.width,
            height: data.height,
          });
        }
      };
      fetchPin();
    }
  }, [id]);

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: addPost,
    onSuccess: (data) => {
      resetStore();
      navigate(`/pin/${data._id}`);
    },
  });

  const editMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: (data) => {
      navigate(`/pin/${data._id}`);
    },
  });

  const handleSubmit = async () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      if (id) {
        // --- EDIT MODE ---
        const payload = {
          title: formRef.current.title.value,
          description: formRef.current.description.value,
          link: formRef.current.link.value,
          tags: formRef.current.tags.value
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          board: formRef.current.board.value || null,
        };
        editMutation.mutate({ id, data: payload });
      } else {
        // --- CREATE MODE ---
        const formData = new FormData(formRef.current);
        formData.append("media", file);
        formData.append("textOptions", JSON.stringify(textOptions));
        formData.append("canvasOptions", JSON.stringify(canvasOptions));
        formData.append("newBoard", newBoard);
        createMutation.mutate(formData);
      }
    }
  };

  // --- Lấy danh sách boards ---
  const { data, isPending, error } = useQuery({
    queryKey: ["formBoards"],
    queryFn: () =>
      apiRequest.get(`/boards/${currentUser._id}`).then((res) => res.data),
  });

  const handleNewBoard = () => {
    setIsNewBoardOpen((prev) => !prev);
  };

  return (
    <div className="createPage">
      <div className="createTop">
        <h1>{id ? "Edit Pin" : "Create Pin"}</h1>
        <button onClick={handleSubmit}>{id ? "Update" : "Publish"}</button>
      </div>
      {isEditing ? (
        <Editor previewImg={previewImg} />
      ) : (
        <div className="createBottom">
          {previewImg.url ? (
            <div className="preview">
              <img src={previewImg.url} alt="" />
              {!id && ( // chỉ cho edit ảnh nếu đang tạo mới
                <div className="editIcon" onClick={() => setIsEditing(true)}>
                  <IKImage path="/general/edit.svg" alt="" />
                </div>
              )}
            </div>
          ) : (
            <>
              <label htmlFor="file" className="upload">
                <div className="uploadTitle">
                  <IKImage path="/general/upload.svg" alt="" />
                  <span>Choose a file</span>
                </div>
                <div className="uploadInfo">
                  We recommend using high quality .jpg files less than 20 MB or
                  .mp4 files less than 200 MB.
                </div>
              </label>
              <input
                type="file"
                id="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </>
          )}
          <form className="createForm" ref={formRef}>
            <div className="createFormItem">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                placeholder="Add a title"
                name="title"
                id="title"
              />
            </div>
            <div className="createFormItem">
              <label htmlFor="description">Description</label>
              <textarea
                rows={6}
                type="text"
                placeholder="Add a detailed description"
                name="description"
                id="description"
              />
            </div>
            <div className="createFormItem">
              <label htmlFor="link">Link</label>
              <input
                type="text"
                placeholder="Add a link"
                name="link"
                id="link"
              />
            </div>
            {!isPending && !error && (
              <div className="createFormItem">
                <label htmlFor="board">Board</label>
                <select name="board" id="board">
                  <option value="">Choose a board</option>
                  {data?.map((board) => (
                    <option value={board._id} key={board._id}>
                      {board.title}
                    </option>
                  ))}
                </select>
                <div className="newBoard">
                  {newBoard && (
                    <div className="newBoardContainer">
                      <div className="newBoardItem">{newBoard}</div>
                    </div>
                  )}
                  <div className="createBoardButton" onClick={handleNewBoard}>
                    Create new board
                  </div>
                </div>
              </div>
            )}
            <div className="createFormItem">
              <label htmlFor="tags">Tagged topics</label>
              <input type="text" placeholder="Add tags" name="tags" id="tags" />
              <small>Don&apos;t worry, people won&apos;t see your tags</small>
            </div>
          </form>
          {isNewBoardOpen && (
            <BoardForm
              setIsNewBoardOpen={setIsNewBoardOpen}
              setNewBoard={setNewBoard}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CreatePage;
