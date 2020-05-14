import {
  Modal, ModalBody, ModalButton, ModalFooter, ModalHeader,
} from 'baseui/modal';
import { useState } from 'react';

interface VisualisationModalProps {
  triggerOpen: boolean;
}

const VisualisationModal: React.FC<VisualisationModalProps> = ({ triggerOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <>
      <Modal onClose={closeModal} isOpen={isOpen || triggerOpen}>
        <ModalHeader>Sample Title</ModalHeader>
        <ModalBody>
          Sample body
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
