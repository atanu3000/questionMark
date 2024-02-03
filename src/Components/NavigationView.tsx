import {
  DrawerLayoutAndroid,
  FlatList,
  Share,
  StyleSheet,
  Text,
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

interface QueryResponse {
  query: string;
  responses: string[];
}

// Save data to local storage
export const saveData = async (query: string, response: string) => {
  try {
    const existingData = await AsyncStorage.getItem('questionMark app data');
    let existingQueryResponses: QueryResponse[] = [];

    if (existingData) {
      existingQueryResponses = JSON.parse(existingData);

      if (!Array.isArray(existingQueryResponses)) {
        existingQueryResponses = [];
      }
    }

    const existingQueryIndex = existingQueryResponses.findIndex(
      item => item.query === query,
    );

    if (existingQueryIndex !== -1) {
      existingQueryResponses[existingQueryIndex].responses.push(response);
    } else {
      existingQueryResponses.push({query, responses: [response]});
    }

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
  const [sharableContent, setSharableContent] = useState<string>('');

  // Retrieve data from AsyncStorage
  const fetchData = async (): Promise<QueryResponse[]> => {
    const existingData = await AsyncStorage.getItem('questionMark app data');
    const parsedData = existingData ? JSON.parse(existingData) : [];

    return parsedData;
  };

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchData();
      setData(data);
    };
    const intervalId = setInterval(fetch, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLongPress = (item: QueryResponse) => {
    const content =
      item.query + '\n\n' + item.responses.join('\n\n● ').replace(/\*\*/g, '*');
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

  const handleDelete = () => {};

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
        renderItem={({item}: {item: QueryResponse}) => (
          <TouchableOpacity onLongPress={() => handleLongPress(item)}>
            <View style={{padding: 10}}>
              <Text style={styles.queryStyle}>
                {item.query.split('').slice(0, 40)}
                {item.query.length > 40 && '...'} ({item.responses.length})
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.query}
      />

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
                  <MenuOption onSelect={handleDelete}>
                    <View style={[styles.options, {paddingBottom: 8}]}>
                      <Icon name="trash" color={'#555'} size={22} />
                      <Text style={{color: '#555', fontSize: 16}}>Delete</Text>
                    </View>
                  </MenuOption>
                  <View style={{backgroundColor: '#555', height: 1.5}}></View>
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
    height: 160,
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
