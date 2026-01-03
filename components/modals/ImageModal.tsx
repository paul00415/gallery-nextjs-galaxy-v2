'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import { useState, useEffect } from 'react';

import NormalInput from '../../components/InputFields/NormalInput';
import TextareaInput from '../../components/InputFields/TextareaInput';
import ImageInput from '../../components/InputFields/ImageInput';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { uploadPhoto, updatePhoto } from '@/store/photo/photoSlice';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialData?: {
    id: number;
    title: string;
    desc: string;
    imageUrl: string;
  } | null;
}

export default function ImageModal({
  isOpen,
  onClose,
  mode,
  initialData,
}: ImageModalProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.photo);

  const isEdit = mode === 'edit';

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');

  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setSubmitted(false);
    setTitleError('');
    setDescriptionError('');

    if (isEdit && initialData) {
      setTitle(initialData.title);
      setDescription(initialData.desc);
      setPreviewUrl(initialData.imageUrl);
      setImage(null);
    } else {
      setTitle('');
      setDescription('');
      setPreviewUrl(null);
      setImage(null);
    }
  }, [isOpen, isEdit, initialData]);

  const handleSubmit = async () => {
    setSubmitted(true);

    let hasError = false;

    // reset errors
    setTitleError('');
    setDescriptionError('');

    // IMAGE (add mode only)
    if (!isEdit && !image) {
      hasError = true;
    }

    // TITLE
    if (!title.trim()) {
      setTitleError('Title is required');
      hasError = true;
    }

    // DESCRIPTION
    if (!description.trim()) {
      setDescriptionError('Description is required');
      hasError = true;
    }

    // Stop if any validation failed
    if (hasError) return;

    try {
      if (isEdit && initialData) {
        await dispatch(
          updatePhoto({
            id: initialData.id,
            title,
            desc: description,
            image,
            oldImageUrl: initialData.imageUrl,
          })
        ).unwrap();
      } else {
        console.log('Uploading new photo');
        await dispatch(
          uploadPhoto({
            image: image!,
            title,
            description,
          })
        ).unwrap();
      }

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              {isEdit ? 'Edit Photo' : 'Add New Photo'}
            </ModalHeader>

            <ModalBody className="gap-4">
              <div className="flex justify-center">
                <ImageInput
                  value={image}
                  previewUrl={previewUrl}
                  onChange={(file) => {
                    setImage(file);
                    if (file) {
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                  hasError={submitted && !isEdit && !image}
                  errorMessage="Image is required"
                />
              </div>

              <NormalInput
                label="Title"
                value={title}
                placeholder="Photo title"
                onChange={(e) => setTitle(e.target.value)}
                error={titleError}
              />

              <TextareaInput
                label="Description"
                placeholder="Photo description"
                value={description}
                onValueChange={setDescription}
                error={descriptionError}
              />

              {error && (
                <p className="text-sm text-red-500 text-center">
                  {error}
                </p>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
                isDisabled={loading}
              >
                Cancel
              </Button>

              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={loading}
              >
                {isEdit ? 'Save Changes' : 'Add Photo'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
