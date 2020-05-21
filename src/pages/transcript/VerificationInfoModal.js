import React from 'react';
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap';
import './style.css';
import PropTypes from 'prop-types';
import config from '../../core/configs';
import { generalUtils } from '../../core/utils/general';

class VerificationInfoModal extends React.Component {
  static propTypes = {
    toggleModal: PropTypes.func.isRequired,
    openModal: PropTypes.bool,
    verification: PropTypes.object.isRequired,
  };

  static defaultProps = {
    openModal: false,
    verification: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      verifier: '',
      shareUrl: '',
      expirationTime: '',
    };
  }

  componentDidMount() {
    console.log(generalUtils.parseDateTime(this.props.verification.expirationTime))
  }

  static getDerivedStateFromProps(props, state) {
    console.log(generalUtils.parseDateTime(props.verification.expirationTime))
    return {
      verifier: props.verification.verifier,
      shareUrl: config.VERIFICATION_URL + props.verification.shareCode,
      expirationTime: generalUtils.parseDateTime(props.verification.expirationTime),
    };
  }

  render() {
    return (
      <Modal
        className={'verification-modal'}
        isOpen={this.props.openModal}
        toggle={this.props.toggleModal}
        backdrop={true}
        keyboard={true}
      >
        <ModalBody>
          <div>
            Part of your transcript is shared to <strong>{this.state.verifier}</strong>
            <div>
              <span>Shared URL</span> <span>{this.state.shareUrl}</span>
            </div>
            <div>
              <span>Expiration time</span> <span>{this.state.expirationTime}</span>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.props.toggleModal}>
            OK
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default VerificationInfoModal;
