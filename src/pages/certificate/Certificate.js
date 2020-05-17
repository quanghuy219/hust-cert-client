import React from 'react';
import Blockcerts from 'react-blockcerts';
import { Modal, ModalBody, Button, ModalFooter } from 'reactstrap';

class Certificate extends React.PureComponent {
  render() {
    const cssModule = {
      "max-width": "60vw"
    }

    return (
      <div>
        <Modal isOpen={this.props.openModal} toggle={this.props.toggle} size='lg'>
          <ModalBody>
						{this.props.certificate && <Blockcerts src={this.props.certificate} theme="light"/>}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.props.toggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Certificate;
