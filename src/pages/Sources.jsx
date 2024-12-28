import { InnerLayout } from "../layout/InnerLayout";
import { SettingsNav } from "../components/Settings/SettingsNav";
import { Modal } from "../components/Modal/Modal";
import { ConfirmDeleteModal } from "../components/Modal/ConfirmDeleteModal";
import { ListItem } from "../components/Settings/ListItem";
import { FormInput } from "../components/Form/FormInput";
import { FaCubesStacked } from "react-icons/fa6";
import { MdEdit, MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  getSources,
  createSource,
  updateSource,
  deleteSource,
} from "wasp/client/operations";

export const Sources = ({ user }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [sourceName, setSourceName] = useState("");
  const [slug, setSlug] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [link, setLink] = useState("");

  const fetchSources = async () => {
    try {
      const response = await getSources({
        organizationId: user.organizationId,
      });
      setSources(response);
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const resetModal = () => {
    setTimeout(() => {
      setSelectedSource(null);
      setSourceName("");
      setSlug("");
      setIconUrl("");
      setLink("");
      setIsEditMode(false);
    }, 500);
  };

  const handleAddOrUpdateSource = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateSource({
          id: selectedSource.id,
          name: sourceName,
          slug,
          iconUrl,
          link,
        });
      } else {
        await createSource({
          name: sourceName,
          slug,
          iconUrl,
          link,
          organizationId: user.organizationId,
        });
      }
      setModalOpen(false);
      fetchSources();
    } catch (error) {
      console.error("Error handling source:", error);
    }
  };

  const handleEdit = (source) => {
    setSelectedSource(source);
    setSourceName(source.name);
    setSlug(source.slug);
    setIconUrl(source.iconUrl);
    setLink(source.link);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const confirmDelete = (source) => {
    setSelectedSource(source);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteSource({ id: selectedSource.id });
      setDeleteModalOpen(false);
      fetchSources();
    } catch (error) {
      console.error("Error deleting source:", error);
    }
  };

  return (
    <InnerLayout
      Nav={SettingsNav}
      childHeader="Sources"
      ChildIcon={FaCubesStacked}
    >
      <div className="max-w-3xl w-full flex flex-col">
        <div className="settings-header w-full">
          <h2 className="h4">Sources</h2>
          <button
            className="btn btn-primary"
            onClick={() => setModalOpen(true)}
          >
            Add Source
          </button>
        </div>
        <ul className="flex flex-col gap-5 mt-5 w-full">
          {sources.map((source) => (
            <ListItem key={source.id}>
              <div>
                <a href={source.link} target="_blank" rel="noopener noreferrer">
                  <div className="source-title">
                    {source.iconUrl && (
                      <span>
                        <img
                          className="source-logo"
                          src={source.iconUrl}
                          alt={source.slug ? source.slug : source.name}
                        />
                      </span>
                    )}
                    <h4>{source.name}</h4>
                  </div>
                </a>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="btn btn-outline hover-btn-bg"
                  onClick={() => handleEdit(source)}
                >
                  <MdEdit size={30} />
                </button>
                <button
                  className="btn btn-outline tomato-btn-bg"
                  onClick={() => confirmDelete(source)}
                >
                  <MdDelete size={30} />
                </button>
              </div>
            </ListItem>
          ))}
        </ul>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="h4">{isEditMode ? "Edit Source" : "Add Source"}</h2>
        <form onSubmit={handleAddOrUpdateSource} className="w-full">
          <FormInput>
            <label htmlFor="sourceName">Source Name</label>
            <input
              type="text"
              id="sourceName"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              required
            />
          </FormInput>
          <FormInput>
            <label htmlFor="slug">Slug</label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </FormInput>
          <FormInput>
            <label htmlFor="iconUrl">Icon URL</label>
            <input
              type="url"
              id="iconUrl"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              required
            />
          </FormInput>
          <FormInput>
            <label htmlFor="link">Link</label>
            <input
              type="url"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </FormInput>
          <button type="submit" className="btn btn-primary">
            {isEditMode ? "Update Source" : "Add Source"}
          </button>
        </form>
      </Modal>
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedSource?.name || "this source"}
      />
    </InnerLayout>
  );
};
