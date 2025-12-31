'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import { useState, useEffect, useEffectEvent } from 'react';

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

type EditPhotoData = NonNullable<ImageModalProps['initialData']>;

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

  const setEditData = useEffectEvent((initialData: EditPhotoData) => {
    setTitle(initialData.title);
    setDescription(initialData.desc);
    setImage(null); // only set if user chooses new image
    setPreviewUrl(initialData.imageUrl);
  });

  const setEmptyData = useEffectEvent(() => {
    setTitle('');
    setDescription('');
    setImage(null);
    setPreviewUrl(null);
  });

  useEffect(() => {
    if (isEdit && initialData && isOpen) {
      setEditData(initialData);
    }

    if (!isEdit && isOpen) {
      setEmptyData();
    }
  }, [isEdit, initialData, isOpen]);

  const handleSubmit = async () => {
    // Validation
    setTitleError('');
    setDescriptionError('');

    if (!isEdit && !image) {
      alert('Image is required');
      return;
    }

    if (!title) {
      setTitleError('Title is required');
      return;
    }

    if (!description) {
      setDescriptionError('Description is required');
      return;
    }

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
        // Dispatch upload flow
        await dispatch(
          uploadPhoto({
            image: image!,
            title,
            description,
          })
        ).unwrap();
      }
      // Close modal ONLY on success
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
      <ModalContent>
        {() => (
          <>
            <ModalHeader>{isEdit ? 'Edit Photo' : 'Add New Photo'}</ModalHeader>

            <ModalBody className="gap-4">
              <div className="flex flex-col justify-center items-center">
                <ImageInput
                  value={image}
                  previewUrl={previewUrl}
                  onChange={(file) => {
                    setImage(file);
                    if (file) {
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                  required={!isEdit}
                  noImage={isEdit ? 'undefined' : 'Image is required'}
                />
                {image && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected file: {image.name}
                  </p>
                )}
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
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
            </ModalBody>

            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={loading}>
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
