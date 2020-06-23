import React from 'react';
import Blockcerts from 'react-blockcerts';
import { Modal, ModalBody, Button, ModalFooter } from 'reactstrap';
import { certificateAction } from '../../actions/certificate';
import PropTypes from 'prop-types';
import './style.css';

class Certificate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      certificate: null
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.openModal) {
      return {
        certificateID: props.certificateID,
        certificateType: props.certificateType
      }
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.openModal && this.props.certificateID && !this.state.certificate) {
      this.openCertificateVerificationModal(this.props.certificateID, this.props.type)
    }
  }

  openCertificateVerificationModal(certID, type) {
    certificateAction.getCertificateContent(certID, type).then((data) => {
      this.setState({
        openModal: true,
        certificate: JSON.parse(data),
        certificateType: type,
      });
    });
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.openModal}
          toggle={this.props.toggle}
          size="xl"
          className="certificate-modal"
        >
          <ModalBody>
            {this.props.certificateID && this.state.certificate && this.props.type === 'certificate' && (
              <Blockcerts src={this.state.certificate} />
            )}
            {this.state.certificate && this.props.type === 'template' && (
              <div dangerouslySetInnerHTML={{ __html: this.state.certificate.displayHtml }}></div>
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
  certificateID: PropTypes.number,
  toggle: PropTypes.func.isRequired,
};
Certificate.defaultProps = {
  type: 'certificate',
};

export default Certificate;
