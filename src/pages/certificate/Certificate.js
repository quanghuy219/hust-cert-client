import React from 'react';
import { connect } from 'react-redux';
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
    this.closeModal = this.closeModal.bind(this);
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
    this.props.getCertificateContent(certID, type).then((data) => {
      this.setState({
        certificate: JSON.parse(data),
        certificateType: type,
        openModal: true
      });
    });
  }

  closeModal() {
    this.setState({
      certificate: null
    })
    this.props.toggle()
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
            <Button color="secondary" onClick={this.closeModal}>
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

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

const mapDispatchToProps = {
  getCertificateContent: certificateAction.getCertificateContent,
};

export default connect(mapStateToProps, mapDispatchToProps)(Certificate);
