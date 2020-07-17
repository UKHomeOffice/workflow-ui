import axios from 'axios';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import qs from 'querystring';

class FileService {
  constructor(keycloak) {
    this.keycloak = keycloak;
  }

  // eslint-disable-next-line no-unused-vars
  async uploadFile(storage, file, fileName, dir, evt, url, options) {
    const fd = new FormData();

    const data = {
      file,
      name: fileName,
      dir,
    };

    Object.keys(data).forEach((key) => {
      fd.append(key, data[key]);
    });
    const token = await this.getToken();
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress(progressEvent) {
        evt({
          total: progressEvent.total,
          loaded: progressEvent.loaded,
        });
      },
    };

    const response = await axios.post(url, fd, config);
    return {
      storage: 'url',
      fileName,
      url: response.data.url,
      size: file.size,
      type: file.type,
      data: response.data,
    };
  }

  async getToken() {
    let { token } = this.keycloak;
    const isExpired = jwt_decode(token).exp < new Date().getTime() / 1000;
    if (isExpired) {
      try {
        const response = await axios({
          method: 'POST',
          url: `${this.keycloak.authServerUrl}/realms/${this.keycloak.realm}/protocol/openid-connect/token`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: qs.stringify({
            grant_type: 'refresh_token',
            client_id: this.keycloak.clientId,
            refresh_token: this.keycloak.refreshToken,
          }),
        });
        token = response.data.access_token;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
    return token;
  }

  async deleteFile(fileInfo) {
    const token = await this.getToken();
    return new Promise((resolve, reject) => {
      axios.delete(fileInfo.url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(() => {
        resolve('File deleted');
      }).catch((e) => {
        reject(e.message || 'Failed to delete file');
      });
    });
  }

  // eslint-disable-next-line no-unused-vars
  async downloadFile(fileInfo, options) {
    const token = await this.getToken();
    return new Promise((resolve, reject) => {
      axios({
        url: fileInfo.url,
        method: 'GET',
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        const file = new Blob([response.data]);
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', `${fileInfo.originalName}`);
        document.body.appendChild(link);
        link.click();
        resolve();
      }).catch((e) => {
        reject(e);
      });
    });
  }
}

export default FileService;
