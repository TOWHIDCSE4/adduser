interface ValidatorHook {
  validatorRePassword: any,
  CustomRegex: Function,
  phoneNumberSGP: Function,
  formatCurrency: any,
  parserCurrency: any,
  limitSizeImage: Function,
  extensionImage: Function,
  limitSizeImageSP: Function,
  limitWidthHeightImage: Function,
  extensionImageSP: Function,
  limitImage: Function,
  regexSpecialChar: Function,
  binaryFileExtension: Function
  limitDurationVideo: Function
}

const useValidatorHooks = (): ValidatorHook => {
  const validatorRePassword = ({ key, getFieldValue, message }: { key: string, getFieldValue: Function, message: string }) => ({
    validator: (rule: any, value: any) => {
      if (!value || getFieldValue(key) === value) {
        return Promise.resolve();
      }
      return Promise.reject(message);
    }
  })

  const CustomRegex = ({ reGex, length, message }: { reGex: string, length: number, message: string }) => ({
    validator: (rule: any, value: any) => {
      if (message === "" || !reGex || !value || value.length < length) {
        return Promise.resolve();
      }
      let regEx = new RegExp(reGex, "g")
      let isValid = regEx.test(value)
      if (!isValid) return Promise.reject(message)
      return Promise.resolve();
    }
  })

  const phoneNumberSGP = ({ message }: { message: string }) => ({
    validator: (rule: any, value: any) => {
      if(!value) return Promise.resolve();
      let re = /^([3|6|8|9]\d{7}|65[3|6|8|9]\d{7}|\+65(\s)?[3|6|8|9]\d{7})$/;
      if(!re.test(String(value).toLowerCase())){
        return Promise.reject(message)
      }
      return Promise.resolve();
    }
  })

  const extensionImageSP = (message: string, arrType: any[], extendType?: string[]) => ({
    validator: (rule: any, value: any) => {
      if (message === "" || !value || value.length == 0) {
        return Promise.resolve();
      }
      if (value.length) {
        let pass = true
        for (let item of value) {
          if (!arrType.includes(item.type) && !checkExtendType(extendType, item.name)) {
            item.status = 'error'
            pass = false
          }
        }
        if (!pass) return Promise.reject(message)
      }
      return Promise.resolve();
    }
  })

  const checkExtendType = (extendType: string[]|null|undefined, fileName: string) => {
    if(!extendType || extendType.length === 0) return true;
    let state =  extendType.some((ext:string) => new RegExp(`\\.${ext}$`, 'i').test(fileName))
    return state
  }

  const limitWidthHeightImage = (width: number, height: number, message: string) => ({
    validator: async (rule: any, value: any) => {
      if (message === "" || !value || value.length == 0) {
        return Promise.resolve();
      };
      await new Promise(r => setTimeout(r, 400));
      let pass = true
      for (let item of value) {
        if (item.dimension) {
          if (item.dimension.w != width || item.dimension.h != height) {
            item.status = 'error'
            pass = false
          }
        }
      }
      if (!pass) return Promise.reject(message)
      return Promise.resolve();
    }
  })

  const binaryFileExtension = (message: string, arrType: any[]) => ({
    validator: async (rule: any, value: any) => {
      if (message === "" || !value || value.length == 0) {
        return Promise.resolve();
      }
      await new Promise(r => setTimeout(r, 400));
      if (value.length) {
        let pass = true
        for (let item of value) {
          if ((!arrType.includes(item.binaryType))) {
            item.status = 'error'
            pass = false
          }
        }
        if (!pass) return Promise.reject(message)
      }
      return Promise.resolve();
    }
  })

  const regexSpecialChar = (message: string) => ({
    validator: (rule: any, value: any) => {
      if (message === "" || !value || value.length == 0) {
        return Promise.resolve();
      }
      let regex = /[`!@#$%^&*()+\-=\[\]{};':"\\|,<>\/?~]/
      if(String(value).match(regex)) return Promise.reject(message)
      return Promise.resolve()
    }
  })

  const limitSizeImageSP = (message: string, max: number) => ({
    validator: (rule: any, value: any) => {
      if (message === "" || !value || value.length == 0) {
        return Promise.resolve();
      }
      if (value.length) {
        let pass = true
        for (let item of value) {
          if ((item.size / 1024 / 1024) > max) {
            item.status = 'error'
            pass = false
          }
        }
        if (!pass) return Promise.reject(message)
      }
      return Promise.resolve();
    }
  })

  const extensionImage = (message: string) => ({
    validator: (rule: any, value: any) => {
      if(value) {
        let { file } = value
        const isJpgOrPng = ['image/jpeg', 'image/png'].includes(file.type)
        if (!isJpgOrPng) return Promise.reject(message)
        return Promise.resolve();
      }
      return Promise.resolve();
    }
  })

  const limitImage = (message: string, max: number) => ({
    validator: (rule: any, value: any[]) => {
      if (Array.isArray(value)) {
        if (value.length > max) return Promise.reject(message)
      }
      return Promise.resolve();
    }
  })

  const limitSizeImage = (message: string) => ({
    validator: (rule: any, value: any) => {
      if(value) {
        let { file } = value
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) return Promise.reject(message)
        return Promise.resolve();
      }
      return Promise.resolve();
    }
  })

  const limitDurationVideo = (message: string, durations: number[]) => ({
    validator: async (rule: any, value: any) => {
      if (message === "" || !value || value.length == 0) {
        return Promise.resolve();
      }
      if (value.length) {
        let pass = true;
        for (let item of value) {
          let duration: any = await getDurationVideo(item);
          if(!durations.includes(Math.round(duration))) {
            item.status = 'error'
            pass = false
          }
        }
        if (!pass) return Promise.reject(message)
      }
      return Promise.resolve();

    }
  })

  const getDurationVideo = async (file: any) => {
    const video: any = await loadVideo(file);
    return video.duration;
  }


  const loadVideo = (file: any) => new Promise((resolve, reject) => {
    try {
      let video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = function () {
        resolve(this)
      }
      video.onerror = function () {
        reject("Invalid video. Please select a video file.")
      }
      video.src = window.URL.createObjectURL(file)
    } catch (e) {
      reject(e)
    }
  })

  const formatCurrency = (value: any) => `${value}`.replace(/[^0-9]+/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  const parserCurrency = (value: any) => value ? value.replace(/\$\s?|(,*)/g, "") : ""

  return {
    validatorRePassword,
    CustomRegex,
    phoneNumberSGP,
    formatCurrency,
    parserCurrency,
    limitSizeImage,
    extensionImage,
    limitSizeImageSP,
    limitWidthHeightImage,
    extensionImageSP,
    limitImage,
    regexSpecialChar,
    binaryFileExtension,
    limitDurationVideo
  }
}

export default useValidatorHooks
