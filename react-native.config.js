module.exports = {
    dependencies: {
      'react-native-pdf-lib': {
        platforms: {
          android: {
            sourceDir: './node_modules/react-native-pdf-lib/android',
            packageImportPath: 'import com.hopding.pdflib.PDFLibPackage;',
            packageInstance: 'new PDFLibPackage()',
            compileSdkVersion: 30, // Set compileSdkVersion to 30
          },
        },
      },
    },
  };