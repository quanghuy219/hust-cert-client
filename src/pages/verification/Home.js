import React from 'react';
import Dropzone from 'react-dropzone';
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Certificate } from '@blockcerts/cert-verifier-js';
import Blockcerts from 'react-blockcerts';
import './style.css';

class VerificationHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      modalOpen: false,
      certData: null,
      error: false,
    };
  }

  onFileChange = (files) => {
    let file = files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = async (e) => {
      const text = e.target.result;
      this.setState(
        {
          certData: JSON.parse(text),
          error: false
        },
        (e) => {
          this.validateCertificateFormat();
        },
      );
    };
  };

  closeModal = () => {
    this.setState({
      src: null,
      modalOpen: false,
      certData: null,
    });
  };

  validateCertificateFormat = async () => {
    const { certData } = this.state;
    if (!certData) return;

    try {
      let certificate = new Certificate(certData);
      this.setState({
        src: certData,
        modalOpen: true,
      });
    } catch (e) {
      this.setState({
        error: true,
      });
    }
  };

  render() {
    return (
      <div>
        <h5>HUST Certificate Verifier</h5>
        <p>If you are holding a digital certificate, verify it by dropping your file below or contact our students to have them publish their transcript and diploma for you</p>
        <Dropzone onDrop={this.onFileChange} accept=".json">
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps({ className: 'file-container' })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop certificate file here, or click to select file</p>
              </div>
            </section>
          )}
        </Dropzone>

        {this.state.error && (
          <React.Fragment>
            <div className="alert alert-danger" role="alert">
              Not a valid credential. Please check with the issuer or recipient that has
              provided this credential.
            </div>
          </React.Fragment>
        )}

        {this.state.src && (
          <Modal isOpen={this.state.modalOpen} size="xl">
            <ModalBody>
              <Blockcerts src={this.state.src} />
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.closeModal}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </div>
    );
  }
}

export { VerificationHome };
