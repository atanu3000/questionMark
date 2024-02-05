import {
  Alert,
  DrawerLayoutAndroid,
  FlatList,
  Modal,
  Share,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import PreviewScreen from '../screens/PreviewScreen';

export interface QueryResponse {
  query: string;
  responses: string[];
}

// Save data to local storage
export const saveData = async (query: string, response: string) => {
  try {
    const existingData = await AsyncStorage.getItem('questionMark app data');
    let existingQueryResponses: QueryResponse[] = existingData
      ? JSON.parse(existingData)
      : [];

    const existingQueryIndex = existingQueryResponses.findIndex(
      item => item.query === query,
    );

    existingQueryIndex !== -1
      ? existingQueryResponses[existingQueryIndex].responses.push(response)
      : existingQueryResponses.push({query, responses: [response]});

    await AsyncStorage.setItem(
      'questionMark app data',
      JSON.stringify(existingQueryResponses),
    );
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

interface NavigationViewProps {
  drawerRef: React.RefObject<DrawerLayoutAndroid>;
}

const NavigationView: React.FC<NavigationViewProps> = ({drawerRef}) => {
  const [data, setData] = useState<QueryResponse[]>([]);
  const menuRef = useRef<Menu>(null);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [selectedQuery, setSelectedquery] = useState<string>('');
  const [sharableContent, setSharableContent] = useState<string>('');
  const [isPreviewModalVisible, setPreviewModalVisible] = useState<boolean>(false);
  const [selectedContent, setSelectedContent] = useState<QueryResponse>();
  const [isDeleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  // Retrieve data from AsyncStorage
  const fetchData = async (): Promise<QueryResponse[]> => {
    const existingData = await AsyncStorage.getItem('questionMark app data');
    const parsedData = existingData ? JSON.parse(existingData) : [];

    return parsedData;
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const data = await fetchData();
      setData(data);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLongPress = (item: QueryResponse) => {
    const content = item.query + '\n\n' + item.responses.join('\n\n\n ').replace(/\*\*/g, '*');
    setSelectedContent(item);
    setSelectedquery(item.query);
    setSharableContent(content);
    setIsMenuVisible(true);
    menuRef.current?.open();
  };

  const handleShare = () => {
    Share.share({
      message: sharableContent,
    });
    handleClose();
  };

  const handleClose = () => {
    setIsMenuVisible(false);
    menuRef.current?.close();
  };

  const handleDelete = async () => {
    try {
      const existingData = await AsyncStorage.getItem('questionMark app data');

      const existingQueryResponses = existingData
        ? JSON.parse(existingData)
        : [];

      const indexToDelete = existingQueryResponses.findIndex(
        (item: QueryResponse) => item.query === selectedQuery,
      );

      if (indexToDelete !== -1) {
        existingQueryResponses.splice(indexToDelete, 1);
        await AsyncStorage.setItem(
          'questionMark app data',
          JSON.stringify(existingQueryResponses),
        );
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      ToastAndroid.show('Deleted succesfully', ToastAndroid.SHORT)
      handleClose();
      let data = await fetchData();
      setData(data);
    }
  };

  const handleDeleteAll = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete all the recents?',
      [
        {
          text: 'Cancel',
          onPress: () => handleClose(),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
            } catch (error) {
              ToastAndroid.show('Some error occured', ToastAndroid.SHORT)
            } finally {
              ToastAndroid.show('All Recents cleared', ToastAndroid.SHORT)
              handleClose();
              let data = await fetchData();
              setData(data);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  }

  const handleDeleteAlert = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          onPress: () => handleClose(),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {handleDelete()},
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  }

  const handlePreviewButtonClick = () => {
    setPreviewModalVisible(true);
    handleClose();
  };

  return (
    <View>
      <View style={styles.navigationContainer}>
        <Text style={styles.paragraph}>Recents</Text>
        <TouchableOpacity
          style={styles.recentBtn}
          onPress={() => drawerRef.current?.closeDrawer()}>
          <Icon name="angle-left" size={18} color={'#FFF'} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        contentContainerStyle={{paddingBottom: 100}}
        renderItem={({item}: {item: QueryResponse}) => (
          <TouchableOpacity onLongPress={() => handleLongPress(item)}>
            <View style={{padding: 10}}>
              <Text style={styles.queryStyle}>
                {item.query.split('').slice(0, 52)}
                {item.query.length > 52 && '...'}{' '}
                {item.responses.length > 1 && '(' + item.responses.length + ')'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.query}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={isPreviewModalVisible}
        onRequestClose={() => setPreviewModalVisible(false)}>
        <PreviewScreen
          onClose={() => setPreviewModalVisible(false)}
          content={selectedContent}
        />
      </Modal>

      {isMenuVisible && (
        <View style={styles.menuContainer}>
          <MenuProvider>
            <Menu ref={menuRef}>
              <MenuTrigger />
              <MenuOptions>
                <View style={styles.optionContainer}>
                  <MenuOption onSelect={handleShare}>
                    <View style={styles.options}>
                      <Icon
                        name="arrow-up-from-bracket"
                        color={'#555'}
                        size={22}
                      />
                      <Text style={{color: '#555', fontSize: 16}}>Share</Text>
                    </View>
                  </MenuOption>
                  <MenuOption onSelect={handlePreviewButtonClick}>
                    <View style={styles.options}>
                      <Icon name="file-lines" color={'#555'} size={22} />
                      <Text style={{color: '#555', fontSize: 16}}>Preview</Text>
                    </View>
                  </MenuOption>
                  <MenuOption onSelect={handleDeleteAlert}>
                    <View style={[styles.options, {paddingBottom: 8}]}>
                      <Icon name="trash-can" color={'#555'} size={22} />
                      <Text style={{color: '#555', fontSize: 16}}>Delete</Text>
                    </View>
                  </MenuOption>
                  <View style={{backgroundColor: '#555', height: 1.5}}></View>
                  <MenuOption onSelect={handleDeleteAll}>
                    <View style={styles.options}>
                      <Icon name="eraser" color={'#555'} size={22} />
                      <Text style={{color: '#555', fontSize: 16}}>Clear All</Text>
                    </View>
                  </MenuOption>
                  <MenuOption onSelect={handleClose}>
                    <View style={styles.options}>
                      <Icon name="xmark" color={'#555'} size={22} />
                      <Text style={{color: '#555', fontSize: 16}}>Close</Text>
                    </View>
                  </MenuOption>
                </View>
              </MenuOptions>
            </Menu>
          </MenuProvider>
        </View>
      )}
    </View>
  );
};

export default NavigationView;

const styles = StyleSheet.create({
  navigationContainer: {
    backgroundColor: '#D24545',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  queryStyle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
  },
  paragraph: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  recentBtn: {
    backgroundColor: '#FFFFFF55',
    borderRadius: 25,
    padding: 6,
    paddingHorizontal: 10,
  },
  menuContainer: {
    position: 'absolute',
    right: 5,
    top: 68,
    backgroundColor: 'transparent',
    width: 150,
    height: 245,
    borderRadius: 5,
    overflow: 'hidden',
  },
  optionContainer: {
    backgroundColor: '#ddd',
    height: '100%',
    paddingVertical: 14,
    justifyContent: 'space-evenly',
    gap: 5,
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
  },
});
