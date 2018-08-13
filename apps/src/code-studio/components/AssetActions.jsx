import React, {PropTypes} from 'react';
import {assets as assetsApi, files as filesApi} from '@cdo/apps/clientApi';
import i18n from '@cdo/locale';

/**
 * Part of a row in the AssetManager, enables deleting the asset and, if not an audio asset, previewing.
 */
export default class AssetActions extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    useFilesApi: PropTypes.bool.isRequired,
    onChoose: PropTypes.func,
    onDelete: PropTypes.func.isRequired,
    isAudio: PropTypes.bool,

    //Temp prop to hide/show updated styles for audio recording release
    useUpdatedStyles: PropTypes.bool
  };

  state = {
    action: 'normal',
    actionText: ''
  };

  /**
   * Confirm the user actually wants to delete this asset.
   */
  confirmDelete = () => {
    this.setState({action: 'confirming delete', actionText: ''});
  };

  /**
   * This user didn't want to delete this asset.
   */
  cancelDelete = () => {
    this.setState({action: 'normal', actionText: ''});
  };

  /**
   * Delete this asset and notify the parent to remove this row. If the delete
   * fails, flip back to 'confirming delete' and display a message.
   */
  handleDelete = () => {
    this.setState({action: 'deleting', actionText: ''});

    let api = this.props.useFilesApi ? filesApi : assetsApi;
    api.deleteFile(this.props.name, this.props.onDelete, () => {
      this.setState({action: 'confirming delete',
        actionText: i18n.errorDeleting()});
    });
  };

  render() {
    let flex;
    // `flex` is the "Choose" button in file-choose mode, or the filesize.
    if (this.props.onChoose) {
      flex = <button onClick={this.props.onChoose}>{i18n.choose()}</button>;
    } else {
      const size = (this.props.size / 1000).toFixed(2);
      flex = size + ' kb';
    }

    const api = this.props.useFilesApi ? filesApi : assetsApi;
    const src = api.basePath(this.props.name);
    return (
      <td width="250" style={{textAlign: 'right'}}>
        {this.state.action === 'normal' &&
          <div>
            {flex}
            {(!this.props.useUpdatedStyles || (this.props.useUpdatedStyles && !this.props.isAudio)) &&
              <a
                href={src}
                target="_blank"
                style={{backgroundColor: 'transparent'}}
              >
                <button><i className="fa fa-eye"/></button>
              </a>
            }
            <button className="btn-danger" onClick={this.confirmDelete}>
              <i className="fa fa-trash-o"/>
            </button>
          </div>
        }
        {this.state.action === 'confirming delete' &&
          <div>
            <button className="btn-danger" onClick={this.handleDelete}>
              Delete File
              </button>
              <button onClick={this.cancelDelete}>Cancel</button>
            {this.state.actionText}
          </div>
        }
        {this.state.action === 'deleting' &&
          <div>
            <i
              className="fa fa-spinner fa-spin"
              style={{
                fontSize: '32px',
                marginRight: '15px'
              }}
            />
          </div>
        }
      </td>
    );
  }
}
