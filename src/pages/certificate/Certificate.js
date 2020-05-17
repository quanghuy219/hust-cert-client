import React from 'react';
import Blockcerts from 'react-blockcerts';
import { Modal, ModalBody, Button, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import './style.css';

class Certificate extends React.PureComponent {
  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.openModal}
          toggle={this.props.toggle}
          size="lg"
          className="certificate-modal"
        >
          <ModalBody>
            {this.props.certificate && this.props.type === 'certificate' && (
              <Blockcerts src={this.props.certificate} />
            )}
            {this.props.certificate && this.props.type === 'template' && (
              <div dangerouslySetInnerHTML={{ __html: this.props.certificate.displayHtml }}></div>
            )}
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

Certificate.propTypes = {
  certificate: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
};
Certificate.defaultProps = {
  type: 'certificate',
};

export default Certificate;
