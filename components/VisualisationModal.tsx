import {
  Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, SIZE,
} from 'baseui/modal';
import { useEffect, useState } from 'react';
import Calendar from './Calendar';
import MultiLine from './MultiLine';

interface VisualisationModalProps {
  triggerOpen: boolean;
  onClose: () => void;
}

const VisualisationModal: React.FC<VisualisationModalProps> = ({ triggerOpen, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen !== triggerOpen) {
      setIsOpen(triggerOpen);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerOpen]);

  const closeModal = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <>
      <Modal
        animate
        onClose={closeModal}
        isOpen={isOpen}
        size={SIZE.full}
        overrides={{
          Root: {
            style: {
              zIndex: 2,
            },
          },
        }}
      >
        <ModalHeader>Sample Title</ModalHeader>
        <ModalBody>
          <MultiLine />
          <Calendar />
        </ModalBody>
        <ModalFooter>
          <ModalButton kind='tertiary' onClick={closeModal}>
            Cancel
          </ModalButton>
          <ModalButton onClick={closeModal}>Sample</ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default VisualisationModal;
